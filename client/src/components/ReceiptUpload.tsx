import { useState } from 'react';
import api from '../api/axios';

const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

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
    onExtracted?: (draft: Draft) => void;
}

export default function ReceiptCapture({ onClose, onExtracted }: ReceiptCaptureProps) {
    const [accountId] = useState('');
    const [categoryId] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [draft, setDraft] = useState<Draft | null>(null);
    const [loading, setLoading] = useState(false);

    const extract = async (selectedFile: File | null = file) => {
        if (!selectedFile) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('receipt', selectedFile);

            const res = await api.post('/receipts/extract', formData);

            setDraft(res.data.draft);
        } catch (err: any) {
            console.error(err);
            const errorMsg = err.response?.data?.error || err.message || 'Receipt extraction failed';
            alert(`Receipt extraction failed: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const picked = e.target.files?.[0] || null;

        if (picked && !supportedMimeTypes.includes(picked.type)) {
            setFile(null);
            setDraft(null);
            setPreview('');
            e.target.value = '';
            alert('Please choose a JPG, PNG, or WEBP receipt image.');
            return;
        }

        setFile(picked);
        setDraft(null);

        if (picked) {
            setPreview(URL.createObjectURL(picked));
            void extract(picked);
            return;
        }

        setPreview('');
    };

    const confirmToTransaction = async () => {
        if(!draft) return;
        if (!accountId || !categoryId){
            alert('Please select an account and category');
            return;
        }
        try {
            await api.post('/receipts/confirm', {
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
        <div className="p-2" style={{ width: '100%', maxWidth: '600px'}}>
            <div className="card">
                <div className="card-title">
                    <h4 className="text-center pt-4">Receipt Capture</h4>
                <div className="card-body">
                    

                    <input className=""
                        type='file'
                        accept='image/jpeg,image/png,image/webp'
                        onChange={onPick}
                    />

                    {preview ? (
                        <div className="mt-4">
                            <img src={preview} alt='Receipt preview' style={{ width: 280, maxWidth: '100%'}} />
                        </div>
                    ) : null}

                    <div className="mt-4 d-flex justify-content-between">
                        <button type="button" className="btn btn-primary"
                            onClick={() => void extract()}
                            disabled={!file || loading}>
                            {loading ? 'Extracting...' : 'Extract Receipt Again'}
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
                            
                            <div className="d-flex flex-wrap gap-2">
                                {onExtracted && (
                                    <button type="button" className="btn btn-success" onClick={() => onExtracted(draft)}>
                                        Use Extracted Data
                                    </button>
                                )}
                                {!onExtracted && (
                                    <button type="button" className="btn btn-primary" onClick={confirmToTransaction}>
                                        Confirm And Save
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : null}
                    </div>
                </div>
            </div>
        </div>
    );              
}
