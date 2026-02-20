import { useState } from 'react';
import api from '../api/axios';
import {
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF4560'
];

interface CharData {
    name: string;
    value: number;
}
export default function PieChartReport() {
    const [ data, setData] = useState<CharData[]>([]);
    const [ loading, setLoading] = useState(false);
    const [ error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [ endDate, setEndDate] = useState('');

    const renderCustomLabel = ({ name, percent }: any) => {
    return `${name} ${(percent * 100).toFixed(1)}%`;
    };

    async function loadReport() {
        setLoading(true);
        try {
        const res = await api.get('/reports/expenses-by-category', {
            params: { startDate, endDate }
        });
        if (!res.data) {
            setError('Failed to fetch data.');
            return;
        }
        const formatted = res.data.map((row: any) => ({
            name: row['category.name'],
            value: Number(row.total)
        }));
        setData(formatted);
        setError('');
        } catch (error) {
            setError("Error fetching data.");
        } finally {
            setTimeout(() => setLoading(false), 800); // 0.8s delay
        }
    }
    
    return (
        <div className="d-flex flex-column justify-content-center" style={{ minWidth: '800px'}}>
            <div className="row">
                <div className="col-5">
            <div className="card p-4 mt-5" style={{width:'500px'}}>
            <h2 className="text-center">Expenses by Category</h2>
                <div className="card-title">
                    <strong>Pie Chart</strong>
                </div>
            <div className="d-flex flex-column"> 
               <label><strong>Enter start date:</strong></label>
               <input   type="date"
                        value={startDate} onChange={(e)=> setStartDate(e.target.value)} />
                
                <label><strong>Enter end date:</strong></label>
                <input  type="date"
                        value={endDate}
                        onChange={((e) => setEndDate(e.target.value))} />
                
                <button
                    className="btn-primary"
                    onClick={loadReport}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Generate Report'}
                </button>
            </div>
            </div>
            </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {!loading && data.length > 0 && (
                    <div className="col-7 d-flex justify-content-center mt-2">
                        <PieChart width={700} height={500}>
                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                label={renderCustomLabel}
                                outerRadius={200}
                            >
                                {data.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </div>
                )}
        </div>
      </div>
    )
}



