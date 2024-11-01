import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Oct", rating: 4.2, classes: 45 },
  { month: "Nov", rating: 4.5, classes: 48 },
  { month: "Dec", rating: 4.3, classes: 42 },
  { month: "Jan", rating: 4.6, classes: 50 },
  { month: "Feb", rating: 4.8, classes: 52 },
  { month: "Mar", rating: 4.7, classes: 49 },
];

export function PerformanceChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="month"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          yAxisId="left"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="rating"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ strokeWidth: 4 }}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="classes"
          stroke="hsl(var(--destructive))"
          strokeWidth={2}
          dot={{ strokeWidth: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}