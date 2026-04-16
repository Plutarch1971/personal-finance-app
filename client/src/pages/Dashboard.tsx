import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import { useNavigate } from 'react-router-dom';
import IncomePieChart from '../components/IncomePieChart';
import ExpenseByThirtyCard from '../components/ExpenseByThirtyCard';
import ExpenseTrendChart from '../components/ExpenseTrendChart';

export default function Dashboard() {
  const auth = useAuth();
  if (!auth) return null;
  const { logout, token } = auth;

  const username = token
      ? (() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.username ?? payload.name ?? payload.email ?? 'User';
    } catch {
      return 'User';
    }
  })()
  : 'User';

  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    net: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);

      try {
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const res = await api.get('/reports/monthly-summary', {
        params: {
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10),
        },
      });

      setSummary(res.data);
    } catch (error: any) {
      console.error('Failed to load monthly summary:', error);
      setSummary({ income: 0, expense: 0, net: 0 });
    } finally {
      setLoading(false);
    }
    }
    
    load();
  }, []);

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid py-2">
        <div className="mb-4 mt-4">
            <p className="text-white text-end pe-3 fs-5 m-0">
              <span className="fw-normal">Welcome</span>
              <strong className="ms-2">{username}</strong>
            </p>
            <h2 className="text-center text-white fs-1 mt-2 mb-5">Dashboard</h2>
          </div>
            
      <div className="row mt-4">
        {/* ================= SIDEBAR (Desktop Only) ================= */}
        {/* <aside className="col-12 col-lg-2 mb-4 mb-lg-0"> */}
         <aside className="col-12 col-lg-2 p-3 mt-2">
          {/* <div className="d-grid gap-3"> */}
          <div className="d-flex flex-row flex-wrap gap-2 justify-content-center justify-content-lg-start">
            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate('/transactions/new')}
            >
              Add Transaction
            </button>

            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate('/transactions')}
            >
              View Transactions
            </button>

            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate('/report')}
            >
              View Reports
            </button>

            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate('/categories')}
            >
              Category
            </button>

            <button className="btn btn-danger mt-3 py-2" onClick={logout}>
              Logout
            </button>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="col-12 col-lg-10">
          {/* Summary Cards */}
          <SummaryCards summary={summary} />

          {/* ================= EXTRA INFO CARDS ================= */}
          <div className="row mt-2 g-3">
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm h-100 rounded-4">
               <div className="card-body">
                  <h5 className="card-title pt-2">Income by Category:</h5>
                  <p className="small">Last 30 Days</p>
                  {/* <p className="card-text">
                    For last 30 days.
                  </p> */}
                  <IncomePieChart />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100 rounded-4">
                <div className="card-body">
                  <h5 className="card-title pt-2">Expense by Parent Category:</h5>
                   <p className="small">Last 30 Days</p>
                  {/* <p className="card-text">
                    For last 30 days.
                  </p> */}
                  <ExpenseByThirtyCard />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100 rounded-4">
                <div className="card-body">
                  <h5 className="card-title pt-2">Monthly Expense Trend</h5>
                   <p className="small">Last 6 months</p>
                  <ExpenseTrendChart />
                </div>
              </div>
            </div>

          </div>

        </main>
        </div>
      </div>
  );
}