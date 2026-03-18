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

export default function ExpenseByThirtyCard(){
    
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
            async function load(){
              try{
                const res = await api.get('/reports/expense-by-thirty');
                   console.log(res.data);
                const formatted = res.data.map((row: any) => ({
                    // name: row['category.name'],
                    name: row.category?.name,
                    value: Number(row.total),
                }));
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
   