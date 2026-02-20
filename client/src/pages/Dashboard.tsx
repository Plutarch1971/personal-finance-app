import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import AccountTable from '../components/AccountTable';
//import Transaction from '../pages/AddTransaction';
import { useNavigate  }from 'react-router-dom';
//import { Transactions } from '../pages/Transactions';

export default function Dashboard(){
    const auth = useAuth();
    if(!auth) return null;
    const{ logout } = auth;

    const [summary, setSummary] = useState({
        income: 0,
        expense: 0,
        net: 0,
    });
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function load(){
            const startDate = new Date();
            startDate.setDate(1);
            const endDate = new Date();
            
            const  [summaryRes, accountsRes] = await Promise.all([
                api.get('/reports/summary', {
                    params: {
                        startDate: startDate.toISOString().slice(0,10),
                        endDate: endDate.toISOString().slice(0,10),
                    },
                }),
                api.get('/accounts'),
            ]);
            setSummary(summaryRes.data);
            setAccounts(accountsRes.data);
            setLoading(false);
        }
        load();
    }, []);
    if (loading) {
        return <div className="container mt-5">Loading....</div>
    }
    return (
        <div className="container mt-4">
            <div className="row align-items-center mb-4">
                <div className="col-12 text-center">
                    <h2 className="mb-5 mt-5"><strong>Dashboard</strong></h2>
                </div>
            </div>

            <div className="position-fixed" style={{ position: 'fixed', top: '50px', right: '70px' }}>
                <button className="btn btn-danger text-white" onClick={logout}>
                    <strong>
                        Logout
                    </strong>
                </button>
            </div>

            <div className="row">
                <div className="col-2">
                    <div className="d-grid gap-3 mt-2">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/transactions/new')}
                        >
                            <strong>
                            Add Transaction
                            </strong>
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/transactions')}
                        >
                            <strong>
                            View Transactions
                            </strong>
                        </button>

                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/report')}
                        >
                            <strong>
                            View Reports
                            </strong>
                        </button>
                    </div>
                </div>

                <div className="col-10 px-5 py-2">
                    <SummaryCards summary={summary} />
                    <AccountTable accounts={accounts} />
                </div>
            </div>
        </div>
    );
}