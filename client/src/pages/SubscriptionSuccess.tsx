//SubscriptionSuccess.tsx
import { useNavigate } from 'react-router-dom';

export default function SubscriptionSuccess() {
    const navigate = useNavigate();
    
    return (
        <div className="text-white text-center d-flex align-items-center justify-content-center flex-column mt-4 p-4">
            <h1>Subscription Successful!</h1>
            <p>Your subscription has been activated.</p>
            <button
                className="btn btn-success"
                onClick={() => navigate ("/dashboard")}
            >
                Dashboard
            </button>
        </div>
    );
}