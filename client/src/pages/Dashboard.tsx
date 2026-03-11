import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import { useNavigate } from 'react-router-dom';
import IncomePieChart from '../components/IncomePieChart';
import ExpenseByThirtyCard from '../components/ExpenseByThirtyCard';

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
      const startDate = new Date();
      startDate.setDate(1);
      const endDate = new Date();

      const res = await api.get('/reports/summary', {
        params: {
          startDate: startDate.toISOString().slice(0, 10),
          endDate: endDate.toISOString().slice(0, 10),
        },
      });

      setSummary(res.data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid py-2">
      <p className="text-white text-end pe-5 fs-4 mt-4">
        <span className="fw-normal">Welcome</span>
        <strong className="ms-2">{username}</strong>
        </p>
      <div className="row mt-4">
        <h2 className="text-center text-white fs-1 mb-4">
            Dashboard
          </h2>
        {/* ================= SIDEBAR (Desktop Only) ================= */}
        <aside className="col-12 col-lg-2 mb-4 mb-lg-0">
          <div className="d-grid gap-3">
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
          <div className="row mt-4 g-4">
            <div className="col-12 col-lg-4">
              <div className="card shadow-sm h-100 rounded-4">
               <div className="card-body">
                  <h5 className="card-title">Income By Categories</h5>
                  <p className="card-text">
                    For last 30 days.
                  </p>
                  <IncomePieChart />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100 rounded-4">
                <div className="card-body">
                  <h5 className="card-title">Expense By Categories</h5>
                  <p className="card-text">
                    For last 30 days.
                  </p>
                  <ExpenseByThirtyCard />
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100 rounded-4">
                <div className="card-body">
                  <h5 className="card-title">Investments</h5>
                  <p className="card-text">
                    Keep track of investment performance and growth.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </main>
        </div>
      </div>
  );
}