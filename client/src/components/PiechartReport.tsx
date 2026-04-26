import { useState } from 'react';
import api from '../api/axios';
import {
    PieChart,
    Pie,
    Tooltip,
    Legend,
    Cell,
    ResponsiveContainer
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

interface Props {
    onClose: () => void;
}
export default function PieChartReport({onClose}: Props) {
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
            const res = await api.get('/reports/monthly-expenses', {
            params: { startDate, endDate }
        });
        if (!res.data) {
            setError('Failed to fetch data.');
            return;
        }
        const formatted: CharData[] = (res.data??[])
            .map((row: { name: string; value: string | number}) => ({
            name: row.name,
            value: Number(row.value),
        }))
        .filter((item: CharData) => 
            item.name.trim().length > 0  && 
            Number.isFinite(item.value) && 
            item.value > 0);

        console.log(formatted);

        setData(formatted);
        setError(formatted.length ? '' : 'No expense data for the selected dates');
        } catch (error) {
            setError("Error fetching data.");
        } finally {
            setTimeout(() => setLoading(false), 800); // 0.8s delay
        }
    }

    const isChartVisible = data.length > 0 && !loading;
    const renderInsidePercentLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Hide tiny labels to avoid overlap
  if (!percent || percent < 0.04) return null;

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {(percent * 100).toFixed(1)}%
    </text>
  );
};
   

    return ( 
        <>
            <div className="container-fluid h-100">
                <div className="row">
                     {/* Following is the definition to wrap the piechart under the input form  */}
                  <div className="col-12 col-lg-10 d-flex flex-row flex-wrap gap-3">
                    <div className="col-12 col-md-6">
                        <div className="card shadow p-4 w-100">
                            <h3 className="text-center mb-3">
                                Expenses in Pie Chart
                            </h3>
                                
                            <div className="mb-3 mt-4">
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
                                <div className="d-flex align-items-center justify-content-between mt-4 gap-2">
                                    <button
                                        className="btn btn-primary flex-grow-1"
                                        onClick={loadReport}
                                        disabled={loading}
                                    >
                                        {loading 
                                        ? 'Generating...' 
                                        : 'Generate Report'
                                        }
                                    </button>
                                    <button className="btn btn-danger"
                                            type="button"
                                            onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>

                                    {error && <div className="alert alert-danger">{error}</div>}
                             </div>       
                        </div>
                    </div>    
                    {/* Pie Chart */}
                    {isChartVisible && (        
                        <div className="col-12 col-md-6 d-flex justify-content-center">
                            <div className="card shadow p-3 w-100" style={{minHeight: 320}}>
                                <div style={{ width: '100%', height: 300}}>
                                 <ResponsiveContainer width="100%" height="100%">
                                <PieChart width={380} height={380} style={{ backgroundColor:'#f0f0f0'}}>
                                    <Tooltip
                                        formatter={(value) => Number(value?? 0).toLocaleString()}
                                        contentStyle={{ borderRadius: 8 }}
                                    />
                                    <Legend /> 
                                    {/* Pie chart code */}
                                    <Pie
                                        data={data}
                                        dataKey="value"
                                        nameKey="name"
                                        label={renderInsidePercentLabel}
                                        labelLine={false}
                                        outerRadius={90}
                                    >
                                        {data.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                                </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>  
    </>             
    )
}



