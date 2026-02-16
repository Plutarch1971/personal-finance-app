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
    const [ loading, setLoading] = useState(true);
    const [ error, setError] = useState('');
    const [startDate, setStartDate] = useState('');
    const [ endDate, setEndDate] = useState('');

    const renderCustomLabel = ({ name, percent }: any) => {
    return `${name} ${(percent * 100).toFixed(1)}%`;
    };

    async function loadReport() {
        
        try {
        const res = await api.get('/reports/expenses-by-category', {
            params: { startDate, endDate }
        });
        if (!res.data) {
            return setError('Failed to fetch data.')
        }
        const formatted = res.data.map((row: any) => ({
            name: row['category.name'],
            value: Number(row.total)
        }));
        setData(formatted);
        setError('');
        setLoading(false);
        } catch (error) {
            setError("Error fetching data.");
        }
    }
    
    return (
        
        <div className="card p-4">
            <div className="card-title">
                Expenses by Category
            </div>
               <label>Enter start date:</label>
               <input type="date"
                value={startDate} onChange={(e)=> setStartDate(e.target.value)} />
                
                <label>Enter end date:</label>
                <input type="date"
                        value={endDate}
                        onChange={((e) => setEndDate(e.target.value))} />
                
                <button className="btn-primary" 
                onClick={loadReport}>
                { loading ? 'Loading...' : 'Generate Report'}
                </button>
                {error && <div className="alert alert-danger">{error}</div>}
                <PieChart width={800} height={500} style={{marginTop:'2rem', marginLeft:'2rem'}}>
                    <Pie data={data}
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
      
    )
}



