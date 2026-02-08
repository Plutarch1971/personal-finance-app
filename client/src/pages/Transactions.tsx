import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Transaction {
  id: string;
  accountId: string;
  categoryId: string | null;
  amount: string;          // IMPORTANT: string, not number
  description?: string;
  transactionDate: string; // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

export default function Transaction(){


    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [ loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleDelete = async (id: string) => {
        if(!window.confirm('Delete this transaction?')) return;

        try {
            await api.delete(`/transactions/${id}`);

            //UI update (IMPORTANT)
            setTransactions(prev =>
                prev.filter(tx => tx.id !== id)
            );
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete transaction');
        }
    };


    useEffect(() => {
        async function load(){
        try{
            const res = await api.get('/transactions');
            setTransactions(res.data);  
            } catch(err: any){
            console.error('Failed to load transactions', err);
            } finally {
            setLoading(false);
            }
        }
        load();
    },[]);

    if (loading) {
        return <div>Loading.....</div>;
        
    }   
        
    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Transactions</h2>
            <button className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
            >Return to Dashboard</button>
            </div>
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                    <th></th>
                </tr>    
                </thead>
                <tbody>
                    {/*rows go here*/ }
                    {transactions.map(tx => (
                        <tr key={tx.id}>
                            <td>{tx.transactionDate}</td>
                            <td>{tx.description ?? '-'}</td>
                            <td className={`text-end ${Number(tx.amount) < 0 ? 'text-danger': 'text-success'}`}>
                                ${Number(tx.amount).toFixed(2)}
                            </td>
                           
                            <td>
                                <button className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(tx.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>  
                    ))}
                </tbody> 
        </table>
        </div>
    );
    
    
}
