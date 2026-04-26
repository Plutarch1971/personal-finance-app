import { useState } from 'react';
import api from '../api/axios';

type Draft = {
    merchantName: string | null;
    receiptDate: string | null;
    total: number | null;
    currency: string;
    warnings: string[];
    items: Array<{
        description: string | null;
        quantity: number | null;
        unitPrice: number | null;
        total: number | null;
    }>;
};

type ReceiptCaptureProps = {
    onClose?: () => void;
}

export default function ReceiptCapture({ onClose }: ReceiptCaptureProps) {
    const [accountId, setAccountId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(false);

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0] || null;
        setFile(picked);
        setDraft(null);

        if (picked) {
            setPreview(URL.createObjectURL(picked));
        } else {
            setPreview('');
        }
    };

    const extract = async () => {
        if (!file) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('receipt', file);

            const res = await api.post('/receipts/extract', formData, {
                headers: { 'Content-Type': 'multipart/form-data'},
            });

            setDraft(res.data.draft);
        } catch (err) {
            console.error(err);
            alert('Receipt extraction failed');
        } finally {
            setLoading(false);
        }
    };

    const confirmToTransaction = async () => {
        if(!draft) return;
        if (!accountId || !categoryId){
            alert('Please select an account and category');
            return;
        }
        try {
            await api.post('receipts/confirm', {
                accountId,
                categoryId,
                draft,
            });
            alert('Transaction created from receipt');
        } catch (err) {
            console.error(err);
            alert('Failed to save transaction');
        }
    };

    return (
        <div className="p-4" style={{ width: '600px', maxWidth: '800px'}}>
            <div className="card">
                <div className="card-title">
                    <h4 className="text-center pt-4">Receipt Capture</h4>
                <div className="card-body">
                    

                    <input className=""
                        type='file'
                        accept=''
                        capture='environment'
                        onChange={onPick}
                    />

                    {preview ? (
                        <div className="mt-4">
                            <img src={preview} alt='Receipt preview' style={{ width: 280, maxWidth: '100%'}} />
                        </div>
                    ) : null}

                    <div className="mt-4 d-flex justify-content-between">
                        <button className="button"
                            onClick={extract}
                            disabled={!file || loading}>
                            {loading ? 'Extracting...' : 'Extract Receipt'}
                        </button>
                        <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onClose?.()}
                    >
                        Close
                    </button>
                    </div>

                    {draft ? (
                        <div className="mt-4">
                            <p>Merchant: {draft.merchantName || 'Unknown'}</p>
                            <p>Date: {draft.receiptDate || 'Unknown'}</p>
                            <p>Total: {draft.total ?? 'Unknown'} {draft.currency}</p>
                            {draft.warnings?.length ?<p>Warnings: {draft.warnings.join(',')}</p> : null}
                            <button className="button" onClick={confirmToTransaction}>
                                Confirm And Save
                            </button>
                        </div>
                    ) : null}
                    </div>
                </div>
            </div>
        </div>
    );              
}