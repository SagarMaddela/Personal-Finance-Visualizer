import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import '../styles/chart.css';

export default function ExpenseChart({ transactions }) {
  const data = {};

  transactions.forEach(tx => {
    const month = new Date(tx.date).toLocaleString("default", { month: "short", year: "numeric" });
    data[month] = (data[month] || 0) + tx.amount;
  });

  const chartData = Object.entries(data).map(([month, total]) => ({ month, total }));

  return (
    <div className="chart-container">
      <h2>Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" fill="#2e86de" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
