// SubscriptionSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  useEffect(() => {
    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    async function refreshUser() {
      try {
        // Give the Stripe webhook a moment to finish updating the database.
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (cancelled) return;

        const response = await api.get("/users/me");

        if (cancelled) return;

        updateUser(response.data);

        redirectTimer = setTimeout(() => {
          if (!cancelled) {
            navigate("/dashboard");
          }
        }, 1000);
      } catch (error) {
        console.error("Failed to refresh user:", error);

        // Still send the customer to the dashboard.
        if (!cancelled) {
          navigate("/dashboard");
        }
      }
    }

    refreshUser();

    return () => {
      cancelled = true;

      if (redirectTimer) {
        clearTimeout(redirectTimer);
      }
    };
  }, [navigate, updateUser]);

  return (
    <div className="container">
      <div className="text-white text-center d-flex align-items-center justify-content-center flex-column mt-4 p-4">
        <h1>Subscription Successful!</h1>

        <p>Your subscription has been activated.</p>

        <button
          className="btn btn-success"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
