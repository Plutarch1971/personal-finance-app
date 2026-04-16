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
        {/* <div className="container-fluid mt-5"> */}
         {/* <div className="col-10 mt-3"> */}
            <div className="d-flex justify-content-center w-100 px-3" >
               <div className="card w-100"style={{ maxWidth: '1100px'}}>
                    <div className="card-body"> 
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">  
                            <h4 className="card-title mb-0">Your Accounts Balances</h4>      
                            <button className="btn btn-danger" 
                                    type="button"
                                    onClick={onClose}
                            >
                                Close   
                            </button>    
                        </div>

                        <div className="table-responsive">
                            <table className="table table-striped mb-0">             
                                <thead>                                         
                                    <tr>                                        
                                        <th>Name</th>                          
                                        <th>Type</th>                           
                                        <th className="text-end">Balance</th>  
                                    </tr>
                                </thead>
                                <tbody>
                                    {accounts
                                    .filter((a) => !(a.type === 'investment' && Number(a.balance) === 0))
                                    .map((a) => (
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
    {/* </div> */}
   </>
  );
}