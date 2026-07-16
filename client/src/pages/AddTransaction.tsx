// AddTransaction.tsx , this is the transaction landing page with transaction operation buttons
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import TransactionForm from "../components/TransactionForm";


export default function AddTransaction() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<"TransactionForm" | null>(null);

  const auth = useAuth();
  if (!auth) return null;
  const { logout } = auth;

  async function handleCreate(data: unknown) {
    await api.post("/transactions", data);
  }
  return (
    <>
      <div className="pt-4 mt-4 mb-2">
        <h2 className="text-center text-white">Transaction Page</h2>
      </div>
      <div className="row">
        <div className="col-12 col-lg-2 d-flex flex-column gap-2 p-3 mt-2">
          <button
            className="btn btn-outline-light"
            onClick={() => setActiveView("TransactionForm")}
          >
            Add Transaction
          </button>
          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/transactions")}
          >
            View Transaction
          </button>

          <button
            className="btn btn-outline-light"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>
          <button className="btn btn-outline-light" onClick={logout}>
            Logout
          </button>
        </div>
        {/* {Main content area} */}
        <div className="col-12 col-lg-10 p-3 mt-2">
          {activeView === "TransactionForm" && (
            <TransactionForm
              mode="create"
              onSubmit={handleCreate}
              onClose={() => setActiveView(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
