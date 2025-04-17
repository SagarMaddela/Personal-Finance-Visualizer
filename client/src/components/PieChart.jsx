import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/dashboard.css";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#ff69b4"];

export default function CategoryPieChart({ transactions }) {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
  
    // Filter transactions for current month
    const monthlyTransactions = transactions.filter(txn => {
      const txnDate = new Date(txn.date);
      return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
    });
  
    // Calculate category totals for current month
    const categoryTotals = monthlyTransactions.reduce((acc, txn) => {
      acc[txn.category] = (acc[txn.category] || 0) + Number(txn.amount);
      return acc;
    }, {});
  
    const chartData = Object.entries(categoryTotals).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={95}
            fill="#8884d8"
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  }
  
