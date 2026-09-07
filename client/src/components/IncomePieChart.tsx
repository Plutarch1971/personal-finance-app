//IncomePieChart.tsx
import { useState } from "react";
import api from "../api/axios";
import type { PieLabelRenderProps } from "recharts";
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

type Props = {
  onClose?: () => void;
};

export default function IncomePieChart({ onClose }: Props) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadIncomeByCategory = async () => {
    if (!startDate || !endDate) {
      setError("Please select start and end dates");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await api.get("/reports/income-by-category", {
        params: { startDate, endDate },
      });
      const formatted = (res.data ?? []).map(
        (row: { "category.name"?: string; total?: string | number }) => ({
          name: row["category.name"] ?? "Unknown",
          value: Number(row.total ?? 0),
        }),
      );
      setData(formatted);
    } catch (error: unknown) {
      console.error(error);
      setError("Error fetching income by category");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="card rounded-4 p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0 text-dark">Income by Category</h4>
        {onClose && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Start date</label>
        <input
          type="date"
          className="form-control"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label className="form-label mt-2">End date</label>
        <input
          type="date"
          className="form-control"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button
          className="btn btn-primary mt-3"
          onClick={loadIncomeByCategory}
          disabled={loading}
          type="button"
        >
          {loading ? "Loading..." : "View Income"}
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {!data.length && !loading && !error ? (
        <div>No income data available for this date range</div>
      ) : (
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
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [value ?? 0, name ?? ""]} />
              <Legend
                verticalAlign="bottom"
                align="center"
                formatter={(value) => (
                  <span style={{ color: "#1f2937" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
