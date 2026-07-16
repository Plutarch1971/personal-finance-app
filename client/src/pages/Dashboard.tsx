import { lazy, Suspense, useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SummaryCards from "../components/SummaryCards";
import { useNavigate } from "react-router-dom";

const IncomePieChart = lazy(() => import("../components/IncomePieChart"));
const ExpenseTrendChart = lazy(() => import("../components/ExpenseTrendChart"));
const ExpenseByThirtyCard = lazy(
  () => import("../components/ExpenseByThirtyCard"),
);

function formatTrialCountdown(trialEndDate?: string | null) {
  if (!trialEndDate) return null;

  const endDate = new Date(trialEndDate);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return "Your free trial has expired.";
  }

  const totalHours = Math.ceil(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} and ${hours} hour${hours === 1 ? "" : "s"} remaining in your free trial.`;
  }

  return `${hours} hour${hours === 1 ? "" : "s"} remaining in your free trial.`;
}

export default function Dashboard() {
  const auth = useAuth();
  const { logout, token, user } = auth || {
    logout: () => {},
    token: null,
    user: null,
  };

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

        const res = await api.get("/reports/monthly-summary", {
          params: {
            startDate: startDate.toISOString().slice(0, 10),
            endDate: endDate.toISOString().slice(0, 10),
          },
        });

        setSummary(res.data);
      } catch (error: unknown) {
        console.error("Failed to load monthly summary:", error);
        setSummary({ income: 0, expense: 0, net: 0 });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (!auth) return null;

  const username = token
    ? (() => {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          return payload.username ?? payload.name ?? payload.email ?? "User";
        } catch {
          return "User";
        }
      })()
    : "User";

  const trialMessage =
    user?.subscriptionStatus === "trial"
      ? formatTrialCountdown(user?.trialEndDate)
      : null;

  if (loading) {
    return <div className="container text-white mt-5">Loading...</div>;
  }

  return (
    <div className="container-fluid py-2">
      <div className="mb-4 mt-4">
        <p className="text-white text-end pe-3 fs-5 m-0">
          <span className="fw-normal">Welcome</span>
          <strong className="ms-2">{username}</strong>
        </p>
        <h2 className="text-center text-white fs-1 mt-2 mb-3">Dashboard</h2>
        {trialMessage && (
          <div className="text-center mb-4">
            <span className="badge bg-warning text-dark px-3 py-2 fs-6">
              ⏳ {trialMessage}
            </span>
          </div>
        )}
      </div>

      <div className="row mt-4">
        {/* ================= SIDEBAR (Desktop Only) ================= */}
        {/* <aside className="col-12 col-lg-2 mb-4 mb-lg-0"> */}
        <aside className="col-12 col-lg-2 p-3 mt-2">
          {/* <div className="d-grid gap-3"> */}
          <div className="d-flex flex-column flex-wrap gap-2 justify-content-center justify-content-lg-start">
            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate("/transactions/new")}
            >
              Transaction Page
            </button>

            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate("/transactions")}
            >
              View Transactions
            </button>

            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate("/report")}
            >
              View Reports
            </button>

            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate("/categories")}
            >
              Manage Category
            </button>

            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate("/budget")}
            >
              Manage Budget
            </button>
            <button
              className="btn btn-outline-light py-2"
              onClick={() => navigate("/subscribe")}
            >
              Subscription Page
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
            <Suspense
              fallback={<div className="text-white">Loading charts...</div>}
            >
              <div className="col-12 col-lg-4">
                <div className="card shadow-sm h-100 rounded-4">
                  <div className="card-body">
                    <h2 className="card-title pt-2 fs-5">
                      Income by Category:
                    </h2>
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
                    <h5 className="card-title pt-2">
                      Expense by Parent Category:
                    </h5>
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
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
