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
        <div className="container px-2 px-md-6 mt-5" style={{ maxWidth: '900px'}}>
        <div className="row">
         <div className="col-12 px-0 px-md-3">
            <div className="card">
                <div className="row g-2 align-items-center p-3">
                <div className="col-12 col-md-12 col-lg-12 d-flex justify-content-center mt-4">     
                    <h2 className="text-center">Transactions</h2>
                </div>
                <div className="col-12 d-flex justify-content-end justify-content-md-end">     
                    <button className="btn btn-primary mt-4 px-3" 
                            onClick={() => navigate('/dashboard')}
                    >
                    Back
                    </button>
                </div>

            <div className="mt-4" style={{ maxHeight: '400px', overflowY: 'auto'}}>
                <div className="table-responsive" style={{ maxWidth: '900px', margin: '0 auto'}}>
                    <table className="table table-striped table-sm fs-6">
                    <thead className="sticky-top bg-white">
                        <tr>
                            <th className="text-nowrap"><strong>Date</strong></th>
                            <th><strong>Description</strong></th>
                            <th className="text-end"><strong>Amount</strong></th>
                            <th></th>
                        </tr>    
                        </thead>
                        <tbody>
                            {/*rows go here*/ }
                            {transactions.map(tx => (
                                <tr key={tx.id}>
                                    <td className="text-nowrap">{tx.transactionDate}</td>
                                    <td>{tx.description ?? '-'}</td>
                                    <td className={`text-end ${Number(tx.amount) < 0 ? 'text-danger': 'text-success'}`}>
                                        ${Number(tx.amount).toFixed(2)}
                                    </td>
                                    
                                    <td className="text-end text-no">
                                        <div className="d-flex flex-sm-row gap-1 gap-sm-2 justify-content-end gap-2">
                                        <button
                                            className="btn btn-sm btn-warning w-auto w-sm-auto" 
                                            onClick={() => navigate(`/transactions/${tx.id}/edit`)}
                                            >
                                            Edit
                                            </button>
                                            <button className="btn btn-sm btn-danger w-auto w-sm-auto" 
                                        onClick={() => handleDelete(tx.id)}
                                        >
                                            Delete
                                        </button>
                                        </div>
                                    </td>  
                                </tr>  
                            ))}
                        </tbody> 
                    </table>
                </div>
                </div>
             </div>
          </div>
        </div>
     </div>
    </div>
    );        
}
