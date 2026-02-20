import { useState } from 'react';
import api from '../api/axios';

interface monthlySummary {
    income: number;
    expense: number;
    net: number;
}

export default function MonthlySummaryCard() {
    const [monthlySummary, setMonthlySummary] = useState<monthlySummary>({
        income: 0,
        expense: 0,
        net: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.get('/reports/summary', {
                params: { startDate, endDate }
            });
            setMonthlySummary(res.data);
            setError('');
        } catch (error) {
            setError('Error fetching monthly summary');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="col-10 mt-3">
        <div className="d-flex justify-content-center">
            <div style={{ width: '500px' }}>
                <h3 className="text-center mb-3">Monthly Summary</h3>
                <div className="card">
                <div className="card-body">
                    <div className="card-title"><strong>Select a Month</strong></div>
                    <form onSubmit={handleSubmit}>
                        <label className="form-control">Enter start date:</label>
                        <input type="date"
                            value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        />
                        <label className="form-control">Enter end date:</label>
                        <input className="form-control" type="date"
                            value={endDate} onChange={(e) => setEndDate(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">
                            {loading ? 'Loading...' : 'Get Summary'}
                        </button>
                    </form>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <div className="card-body">
                        <p><strong>Income:</strong>${monthlySummary.income}</p>
                        <p><strong>Expense:</strong> ${monthlySummary.expense}</p>
                        <p><strong>Net:</strong> ${monthlySummary.net}</p>
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}