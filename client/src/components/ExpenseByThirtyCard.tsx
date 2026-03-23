import { useState, useEffect } from 'react';
import api from '../api/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
    Cell
} from 'recharts';

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF4560',
];

interface CharData {
    name: string;
    value: number;
}

export default function ExpenseByThirtyCard(){
    
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
         const end = new Date();
     const start = new Date(end);
    start.setDate(end.getDate() -30);
    
    const startDate = start.toISOString().slice(0,10);
    const endDate = end.toISOString().slice(0,10);

            async function load(){
              try{
                const res = await api.get('/reports/monthly-expenses', {
                    params: {startDate, endDate},
                });
                console.log(res.data);

                const formatted : CharData [] = (res.data ?? [])
                    .map((row: { name: string; value: string | number}) => ({
                        name: row.name,
                        value: Number(row.value),
                }))
                .filter((item: CharData) => item.name &&
                Number.isFinite(item.value) &&
                item.value > 0);

                console.log('formatted:', formatted);
                setData(formatted);

                }finally {
                  setLoading(false)
                }

            }    
        load();
    }, []);

    if(loading){
      return  <div> Loading....</div>;
    }  
    
    if (!data.length) {
        return <div>No expense data available.</div>
    }

    return (
        <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                dataKey="name"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value">
                    { data.map((_,idx) => (
                        <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                </Bar> 
            </BarChart>
        </ResponsiveContainer>
    )
    
}
   