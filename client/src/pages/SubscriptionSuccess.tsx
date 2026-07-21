//SubscriptionSuccess.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SubscriptionSuccess() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(()=> {
            navigate('/dashboard');
        }, 2500);

        return ()=> clearTimeout(timer);
    }, [navigate]);
    return (
        <div className="container">
            <div className="text-white text-center d-flex align-items-center justify-content-center flex-column mt-4 p-4">
                <h1>Subscription Successful!</h1>
                <p>Your subscription has been activated.</p>
                    <button
                    className="btn btn-success"
                    onClick={() => navigate ("/dashboard")}
                    >
                       Go to Dashboard
                    </button>
            </div>
        </div>
    );
}