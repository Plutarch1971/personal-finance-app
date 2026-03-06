import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import TransactionForm from '../components/TransactionForm';

export default function AddTransaction(){
    const navigate = useNavigate();

    async function handleCreate(data: any) {
        await api.post('/transactions', data);
        navigate('/transactions');
    }
    return (
        <TransactionForm
        mode="create"
        onSubmit={handleCreate}
        />
    );
}