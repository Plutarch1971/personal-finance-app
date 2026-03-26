import { useState, useEffect } from 'react';
import api from '../api/axios';
import type { PieLabelRenderProps } from 'recharts';
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

    const RADIAN = Math.PI / 180;

    
    const renderPercentInside = ({
        cx = 0,
        cy = 0,
        midAngle = 0,
        innerRadius = 0,
        outerRadius = 0,
        percent = 0,
    }: PieLabelRenderProps) => {
        // Skip tiny slices to avoid overlapping/clipping
        if (!percent || percent < 0.06) return null;

        const r = innerRadius + (outerRadius - innerRadius) * 0.55;
        const x = cx + r * Math.cos(-midAngle * RADIAN);
        const y = cy + r * Math.sin(-midAngle * RADIAN);
        
        return (
            <text
            x={x}
            y={y}
            fill="#fff"
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={12}
            fontWeight={600}
            pointerEvents="none"
            >
                {`${Math.round(percent * 100)}%`}
            </text>
        );
    };

    return (
        <ResponsiveContainer width="100%" height={320}>
            <PieChart>
                <Pie 
                data={data} 
                dataKey="value" 
                nameKey="name" 
                cx="50%"
                cy="50%"
                outerRadius={100} 
                innerRadius={45}
                paddingAngle={2}
                labelLine={false}
                label={renderPercentInside}
                >
                 {data.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
                <Tooltip formatter={(value, name) => [value ?? 0, name ?? ""]}/>
                <Legend 
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value) => <span style={{color: '#1f2937'}}>{value}</span>}/>
            </PieChart>
        </ResponsiveContainer>
    );

}
            
        