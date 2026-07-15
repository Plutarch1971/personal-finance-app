// Subscribe.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

type PlanId = 'monthly' | 'yearly';

interface Plan {
    id: PlanId;
    name: string;
    price: string;
    period: string;
    description: string;
    highlight?: string;
}

const plans: Plan[] = [
    {
        id: 'monthly',
        name: 'Monthly',
        price: 'CAD 4.99',
        period: '/ month',
        description: 'Full access, billed monthly. Cancel anytime.',
    },
    {
        id: 'yearly',
        name: 'Yearly',
        price: 'CAD 49.99',
        period: '/ year',
        description: 'Full access, billed yearly. Save 17% compared with monthly billing.',
        highlight: 'Best value',
    },
];

const Subscribe: React.FC= () => {

    const auth = useAuth();
    if (!auth) return null;
    const { logout } = auth;

    const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

    return (
        <div className="d-flex justify-content-center align-items-start px-3 py-5" style={{ minHeight: '100vh' }}>
            <div className="w-100" style={{ maxWidth: '720px' }}>

                {/* ===== HEADER / MESSAGE ===== */}
                <div className="text-center mb-4">
                    <img src="/pwa-192.webp" alt="SmartBooks Finance" style={{ width: '64px', height: '64px' }} className="mb-3" />
                    <h2 className="text-warning fw-bold mb-3">Your trial has expired</h2>
                    <p className="text-white fs-5 mb-0">
                        Your 14-day free trial has expired.
                    </p>

                    <p className="text-white">Choose a subscription below to continue using
                        <span className="fw-bold text-warning"> SmartBooksFinance</span>
                    </p>
                </div>

                {/* ===== PLANS ===== */}
                <div className="row g-3 mb-4">
                    {plans.map((plan) => {
                        const isSelected = selectedPlan === plan.id;
                        return (
                            <div className="col-12 col-md-6" key={plan.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedPlan(plan.id)}
                                    aria-pressed={isSelected}
                                    className={`card h-100 w-100 text-start border-2 shadow-sm ${
                                        isSelected ? 'border-warning' : 'border-secondary'
                                    }`}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? '#1f2a37' : '#111827',
                                        transition: 'border-color .15s ease, background-color .15s ease',
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h5 className="text-white fw-bold mb-0">{plan.name}</h5>
                                            {plan.highlight && (
                                                <span className="badge bg-warning text-dark">{plan.highlight}</span>
                                            )}
                                        </div>
                                        <div className="mb-2">
                                            <span className="text-warning fw-bold fs-3">{plan.price}</span>
                                            <span className="text-white-50 ms-1">{plan.period}</span>
                                        </div>
                                        <p className="text-white-50 mb-0 small">{plan.description}</p>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* ===== CTA ===== */}
                <div className="d-grid">
                    <button type="button" className="btn btn-primary btn-lg fw-bold" disabled>
                        Stripe Checkout coming soon
                    </button>
              
                    
                <p className="text-white-50 text-center small mt-3 mb-0"> ✔  Secure payments powered by Stripe</p>
                <p className="text-white-50 text-center small mt-3 mb-0"> ✔ Cancel anytime</p>
                <p className="text-white-50 text-center small mt-3 mb-0"> ✔  No hidden fees</p>
                  </div>
                  
                  <div className="d-flex align-items-center justify-content-center mt-3">
                   <button className="btn btn-primary bg-danger"
                    onClick={logout}
                    >
                        Logout
                    </button>

                   </div>
            </div>
        </div>
    );
}

export default Subscribe;
