import { useState, useEffect } from 'react';
import api from '../api/axios';

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}

interface Props {
    onClose: () => void;
}
export default function AccountTable({onClose}: Props) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await api.get('/accounts');
                setAccounts(res.data);
                setError('');
            } catch (err) {
                setError('Failed to load accounts');
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <>
        <div className="container-fluid mt-5">
         <div className="row justify-content-center">
           <div className="col-12 col-md-6 d-flex justify-content-center">
        <div className="card" style={{ width: '50vw', marginLeft: '-230px' }}>                                     
            <div className="card-body">  
                <div className="d-flex align-items-center position-relative">                          
                    <h4 className="card-title mb-0 position-absolute start-50 translate-middle-x"
                    >
                            Your Accounts Balances
                    </h4>   
                    <button className="btn btn-danger ms-auto w-25" 
                            type="button"
                            onClick={onClose}
                    >
                        Close   
                    </button>    
                </div>
                <table className="table table-striped">             
                    <thead>                                         
                        <tr>                                        
                            <th>Name</th>                          
                            <th>Type</th>                           
                            <th className="text-end">Balance</th>  
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((a) => (
                            <tr key={a.id}>
                                <td>{a.name}</td>                               {/* Data cell 1*/}
                                <td className="text-capitalize">{a.type}</td>   {/* Data cell 2 */}
                                <td className="text-end">
                                    ${Number(a.balance).toFixed(2)}             {/* Data cell 3*/}
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
   </>
  );
}