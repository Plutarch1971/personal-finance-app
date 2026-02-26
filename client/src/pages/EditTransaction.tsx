{/* Wht this file will do:
1. Get transaction ID from URL
2. Load existing transaction data
3. Load accounts + categories
4. Populate form fields
5. Allow editing
6. Submit PUT request
7. Navigate back to transactions */}

import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';

export default function EditTransaction(){
    const { id } = useParams();
    const navigate = useNavigate();

    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        async function load() {
            const res = await api.get(`/transactions/${id}`);
            setInitialData(res.data);
        }
        load();
    },[id]);

    async function handleUpdate(data: any) {
        await api.put(`/transactions/${id}`, data);
        navigate('/transactions');
    }

    if(!initialData) return <div>Loading....</div>;

    return (
        <TransactionForm 
            mode="edit"
            initialData={initialData}
            onSubmit={handleUpdate}
        />
    )
}