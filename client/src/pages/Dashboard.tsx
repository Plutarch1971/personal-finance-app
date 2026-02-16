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
         <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Dashboard</h2>
            <button
            className="btn btn-primary"
            onClick={() => navigate('/transactions/new')}
            >
                Add Transaction
            </button>
            
            <button
            className="btn btn-primary"
            onClick={() => navigate('/transactions')}
            >
                View Transactions
            </button>

            <button 
            className="btn btn-primary"
            onClick={() => navigate('/report')}
            >
                View Reports
            </button>
            <button className="btn btn-outline-danger" onClick={logout}>
                Logout
            </button>
            </div>
            <SummaryCards summary={summary} />
            <AccountTable accounts={accounts} />
        </div>
    );
}