import { useEffect, useState } from "react";
import api from "../api/axios";
import type {  PieLabelRenderProps } from "recharts";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
];

interface CharData {
  name: string;
  value: string | number;
}
export default function IncomePieChart() {
  const [data, setData] = useState<CharData[]>([]);
  const [loading, setLoading] = useState(true);
// Render percentage
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
  
// /end of percentage rendering

  useEffect(() => {
    async function load() {
      const end = new Date();
      const start = new Date(end);
      start.setDate(end.getDate() - 30);

      const startDate = start.toISOString().slice(0, 10);
      const endDate = end.toISOString().slice(0, 10);

      try {
        const res = await api.get("/reports/income-by-category-30", {
          params: { startDate, endDate },
        });
        const formatted = (res.data ?? []).map(
          (row: { name?: string; total?: string | number }) => ({
            name: row.name ?? "Unknown",
            value: Number(row.total ?? 0),
          }),
        );

        setData(formatted);
      } catch (error) {
        console.error("Failed to load income by category:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data.length) return <div>No income data available.</div>;

  return (
    <div style={{ width: "100%", height: 320, minWidth: 0 }}>
      <ResponsiveContainer width="100%" height="100%">
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
            {data.map((entry, index) => (
              <Cell
                key={`${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
