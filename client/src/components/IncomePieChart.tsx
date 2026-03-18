import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF4560',
];


export default function IncomePieChart() {

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get('/reports/income-by-category');
                const formatted = res.data.map((row: any) => ({
                    name: row['category.name'],
                    value: Number(row.total),
                }));
                setData(formatted);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!data.length) {
        return <div>No income data available.</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie 
                data={data} 
                dataKey="value" 
                nameKey="name" 
                cx="50%"
                cy="50%"
                outerRadius={110} 
                label={({name, percent} : { name?: string; percent?: number}) =>
                 `${name ?? ''} (${(( percent ?? 0) * 100).toFixed(0)}%)`
                }
                >
                 {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );

}
            
        