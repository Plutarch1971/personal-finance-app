import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface Budget {
    categoryId: string;
    amount: number;
    name?: string;
    category?: {
        name: string;
    };
}

export default function BudgetPage() {
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDisplay, setShowDisplay] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Budget starts closed by default
    }, []);

    const handleGetBudget = async () => {
        setLoading(true);
        setShowDisplay(true);
        try {
            const res = await api.get('/budget');
            setBudgets(res.data);
            setIsEditing(false);
        } catch (error: any) {
            console.error('Error fetching budget:', error);
            const msg = error.response?.data?.error || 'Failed to fetch budget data.';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoGenerate = async () => {
        try {
            const res = await api.post('/budget/auto');
            setShowDisplay(true);
            const hasData = res.data.some((b: Budget) => b.amount > 0);
            if (!hasData && res.data.length > 0) {
                alert('No recent transactions found to auto-generate a budget. A blank template has been loaded.');
            } else if (res.data.length === 0) {
                alert('No expense categories found. Please add categories first!');
            }
            setBudgets(res.data);
            setIsEditing(true);
        } catch (error: any) {
            console.error('Error auto-generating budget:', error);
            const msg = error.response?.data?.error || 'Failed to generate budget. Please try again.';
            alert(msg);
        }
    };

    const handleManualBudget = async () => {
        try {
            const res = await api.get('/budget/template');
            setShowDisplay(true);
            if (res.data.length === 0) {
                alert('No expense categories found. Please add categories first!');
            }
            setBudgets(res.data);
            setIsEditing(true);
        } catch (error: any) {
            console.error('Error getting budget template:', error);
            const msg = error.response?.data?.error || 'Failed to initialize manual budget. Please try again.';
            alert(msg);
        }
    };

    const handleSave = async () => {
        try {
            await api.post('/budget', { budgets });
            alert('Budget saved successfully!');
            setIsEditing(false);
            await handleGetBudget();
        } catch (error: any) {
            console.error('Error saving budget:', error);
            const msg = error.response?.data?.error || 'Failed to save budget. Please try again.';
            alert(msg);
        }
    };

    const updateBudget = (categoryId: string, value: string) => {
        const amount = parseFloat(value) || 0;
        setBudgets(prev => prev.map(b => 
            b.categoryId === categoryId ? { ...b, amount } : b
        ));
    };

    const handleCloseBudget = () => {
        setShowDisplay(false);
        setBudgets([]);
        setIsEditing(false);
    };

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-light mt-2">Loading budget data...</p>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4 mt-4">
            <div className="d-flex justify-content-center align-items-center mb-4 px-3">
                <h1 className="text-white">Budget Management</h1>
            </div>

            <div className="row mx-2">
                {/* Left Side: Buttons (col-2 on desktop, col-12 on mobile, with offset to center the group) */}
                <div className="col-12 col-lg-2 offset-lg-1 mb-4 mb-lg-0">
                    <div className="d-grid gap-3">
                        <button 
                            className="btn btn-primary py-3 shadow-sm" 
                            onClick={handleAutoGenerate}
                        >
                            Auto Generate
                        </button>

                        <button 
                            className="btn btn-primary py-3 shadow-sm" 
                            onClick={handleManualBudget}
                        >
                            Manually Generate Budget
                        </button>
                        <button 
                            className="btn btn-success py-3 shadow-sm" 
                            onClick={handleSave}
                        >
                            Save Budget
                        </button>
                        <button 
                            className="btn btn-info py-3 text-white shadow-sm" 
                            onClick={() => {
                                setIsEditing(true);
                                setShowDisplay(true);
                            }}
                        >
                            Update Budget
                        </button>
                        <button 
                            className="btn btn-info py-3 text-white shadow-sm" 
                            onClick={handleGetBudget}
                        >
                            Display Budget
                        </button>
                        <button 
                            className="btn btn-danger py-3 shadow-sm" 
                            onClick={handleCloseBudget}
                        >
                            Close Budget
                        </button>
                        <button 
                            className="btn btn-outline-light py-2"
                            onClick={() => {
                                handleCloseBudget();
                                navigate('/dashboard');
                            }}
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>

                {/* Right Side: Budget Display (col-6 on desktop to keep it centered and compact) */}
                <div className="col-12 col-lg-6">
                    {showDisplay && (
                        <div className="card shadow border-0 rounded-4">
                            <div className="card-body p-4">
                                <h5 className="card-title fw-bold mb-4">Monthly Budget Allocation</h5>
                                {budgets.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p className="text-muted fs-5">No budgets found for this month.</p>
                                        <button 
                                            className="btn btn-primary px-4 mt-2"
                                            onClick={handleAutoGenerate}
                                        >
                                            Create Initial Budget
                                        </button>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="ps-4">Category</th>
                                                    <th className="text-end pe-4">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {budgets.map((b) => (
                                                    <tr key={b.categoryId}>
                                                        <td className="ps-4">
                                                            <span className="fw-semibold text-dark">
                                                                {b.category?.name || b.name || `Category ${b.categoryId}`}
                                                            </span>
                                                        </td>
                                                        <td className="text-end pe-4">
                                                            {isEditing ? (
                                                                <div className="input-group input-group-sm justify-content-end" style={{ maxWidth: '150px', marginLeft: 'auto' }}>
                                                                    <span className="input-group-text">$</span>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control text-end fw-bold"
                                                                        value={b.amount}
                                                                        onChange={(e) => updateBudget(b.categoryId, e.target.value)}
                                                                        step="0.01"
                                                                        min="0"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <span className="fw-bold text-primary fs-5">
                                                                    ${b.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}