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

    const renderCustomLabel = ({ name,percent }:any) =>  {
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

    const isChartVisible = data.length > 0 && !loading;

    return ( 
            <div className="container-fluid h-100">
                <div className="row justify-content-center mt-5" 
                     style={!isChartVisible ? { transform: 'translateX(-8.333%)'} : {}}
                >
                    <div className={
                                isChartVisible
                                ? "col-12 col-md-4" 
                                : "col-12 col-md-6 col-xl-4"
                    }>
                        <div className="card shadow p-4 w-100">
                            <h4 className="text-center mb-3">
                                Expenses in Pie Chart
                            </h4>
                                
                            <div className="mb-3">
                                    <label className="form-label">
                                        <strong>Enter start date:</strong>
                                    </label>

                                    <input  type="date"
                                            className="form-control"
                                            value={startDate} 
                                            onChange={(e)=> 
                                                setStartDate(e.target.value)} 
                                    />
                            
                                    <label className="form-label">
                                        <strong>Enter end date:</strong>
                                    </label>
                                        
                                    <input  type="date"
                                            className="form-control"
                                            value={endDate}
                                            onChange={(e) => 
                                                setEndDate(e.target.value)} 
                                    />
                            
                                    <button
                                        className="btn btn-primary w-100"
                                        onClick={loadReport}
                                        disabled={loading}
                                    >
                                        {loading 
                                        ? 'Generating...' 
                                        : 'Generate Report'
                                        }
                                    </button>

                                    {error && <div className="alert alert-danger">{error}</div>}
                             </div>       
                        </div>
                    </div>    
                    {isChartVisible && (        
                        <div className="col-12 col-md-8 d-flex justify-content-center">
                            <div className="card shadow p-3">
                                <PieChart width={700} height={500} style={{ backgroundColor:'#f0f0f0'}}>
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
                        </div>
                    )}

            </div>
        </div>               
    )
}



