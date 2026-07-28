// SubscriptionSuccess.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/useAuth";

export default function SubscriptionSuccess() {
  const navigate = useNavigate();
  const auth = useAuth();
  const updateUser = auth?.updateUser;

  useEffect(() => {
    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | undefined;

    async function refreshUser() {
      // Give the Stripe webhook time to update Neon.
      for (let attempt = 0; attempt < 5; attempt++) {
        try {
          const response = await api.get("/users/me");

          if (cancelled) return;

          if (response.data.subscriptionStatus === "active") {
            updateUser?.(response.data);

            redirectTimer = setTimeout(() => {
              if (!cancelled) {
                navigate("/dashboard");
              }
            }, 1500);

            return;
          }
        } catch (error) {
          console.error("Failed to refresh user:", error);
        }

        // Wait one second before checking again.
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Don't leave the customer stuck on this page.
      if (!cancelled) {
        navigate("/dashboard");
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
