import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const auth = useAuth();
  if (!auth) return null;
  const { logout } = auth;

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
    <div className="container-fluid py-4">
      <div className="row mt-4">

        {/* ================= SIDEBAR (Desktop Only) ================= */}
        <aside className="col-12 col-lg-2 mb-4 mb-lg-0 mt-4">
          <div className="d-grid gap-3 mt-lg-5">
            <button
              className="btn btn-primary py-2"
              onClick={() => navigate('/transactions/new')}
            >
              Add Transaction
            </button>

            <button
              className="btn btn-primary py-2"
              onClick={() => navigate('/transactions')}
            >
              View Transactions
            </button>

            <button
              className="btn btn-primary py-2"
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
          {/* Title (Centered on Mobile) */}
          <h2 className="text-center fs-1 mb-4">
            Dashboard
          </h2>

          {/* Summary Cards */}
          <SummaryCards summary={summary} />

          {/* ================= EXTRA INFO CARDS ================= */}
          <div className="row mt-4 g-4">

            <div className="col-12 col-lg-4">
              <div className="card shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f"
                  className="card-img-top"
                  alt="Budget"
                />
                <div className="card-body">
                  <h5 className="card-title">Budget Planning</h5>
                  <p className="card-text">
                    Track and adjust your monthly spending to stay within your limits.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1565514020179-026b92b4a5b4"
                  className="card-img-top"
                  alt="Savings"
                />
                <div className="card-body">
                  <h5 className="card-title">Savings Goals</h5>
                  <p className="card-text">
                    Monitor progress toward your financial goals and milestones.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="card shadow-sm h-100">
                <img
                  src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b1"
                  className="card-img-top"
                  alt="Investments"
                />
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