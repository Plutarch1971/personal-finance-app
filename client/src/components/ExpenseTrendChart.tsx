import { useEffect, useState } from "react";
import api from "../api/axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

interface DataPoint {
    month: string;
    total: number;
}

export default function ExpenseTrendChart() {
    const [data, setData] = useState<DataPoint[]>([]);

    useEffect(() => {
        async function load() {
          const res = await api.get("/reports/expense-trend");

          const formatted = res.data.map((item: any) => ({
            month: item.month,
            total: Number(item.total),
          }));

          setData(formatted);
        }

        load();
    }, []);

    return (
        <div style={{width: "100%", height: 300}}>
         <ResponsiveContainer>
            <LineChart data={data}>
             <CartesianGrid strokeDasharray="3 3"/>

             <XAxis dataKey="month" />

             <YAxis />

             <Tooltip />

             <Line
                type="monotone"
                dataKey="total"
                strokeWidth={3}
            />
            </LineChart>
         </ResponsiveContainer>
        </div>
    );
}