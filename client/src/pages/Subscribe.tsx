// Subscribe.tsx
import { useState } from 'react';

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
        description: 'Full access, billed yearly. Save over 16%.',
        highlight: 'Best value',
    },
];

export function Subscribe() {
    const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

    return (
        <div className="d-flex justify-content-center align-items-start px-3 py-5" style={{ minHeight: '100vh' }}>
            <div className="w-100" style={{ maxWidth: '720px' }}>

                {/* ===== HEADER / MESSAGE ===== */}
                <div className="text-center mb-4">
                    <img src="pwa-192.webp" alt="smartbooks-logo" style={{ width: '64px', height: '64px' }} className="mb-3" />
                    <h2 className="text-warning fw-bold mb-3">Your trial has expired</h2>
                    <p className="text-white fs-5 mb-0">
                        Your trial of 14 days have expired, to continue using
                        <span className="fw-bold"> SmartBooksFinance</span> you are required to subscribe.
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
                </div>

                <p className="text-white-50 text-center small mt-3 mb-0">
                    Secure payments will be powered by Stripe.
                </p>
            </div>
        </div>
    );
}
