import { useEffect, useState } from "react";
import api from "../../api";
import PieChart from "../components/PieChart";
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import "../styles/dashboard.css";

const EXPENSE_COLORS = ["#D32F2F","#E53935","#F44336","#EF5350","#E57373","#EF9A9A"];
const INCOME_COLORS = ["#388E3C","#43A047","#4CAF50","#66BB6A","#A5D6A7","#C8E6C9"];


function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await api.get("/transactions");
        setTransactions(response.data);
      } catch (err) {
        setError("Failed to load transactions");
        console.error(err);
      }
    }

    fetchTransactions();
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Filter only current month's transactions
  const monthlyTransactions = transactions.filter(txn => {
    const txnDate = new Date(txn.date);
    return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
  });
  
  // Separate expenses and income
  const monthlyExpenses = monthlyTransactions.filter(txn => txn.amount > 0);
  const monthlyIncome = monthlyTransactions.filter(txn => txn.amount < 0);
  
  // Calculate totals
  const totalExpense = monthlyExpenses.reduce((sum, txn) => sum + Number(txn.amount), 0);
  const totalIncome = monthlyIncome.reduce((sum, txn) => sum + Math.abs(Number(txn.amount)), 0);
  
  // Prepare expense chart data
  const expenseCategoryTotals = monthlyExpenses.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + Number(txn.amount);
    return acc;
  }, {});
  
  const expenseChartData = Object.entries(expenseCategoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));
  
  // Prepare income chart data
  const incomeCategoryTotals = monthlyIncome.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + Math.abs(Number(txn.amount));
    return acc;
  }, {});
  
  const incomeChartData = Object.entries(incomeCategoryTotals).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>DASHBOARD</h1>
      
      {/* Charts Section */}
      <div className="dashboard-charts">
        {/* Expenses Pie Chart */}
        <div className="chart-container">
          <h2>Expenses This Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={expenseChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                fill="#ff6b6b"
                label
              >
                {expenseChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>

        {/* Income Pie Chart */}
        <div className="chart-container">
          <h2>Income This Month</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={incomeChartData}
                dataKey="value"
                nameKey="name"
                outerRadius={95}
                fill="#4CAF50"
                label
              >
                {incomeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={INCOME_COLORS[index % INCOME_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="recent-transactions">
        <h2>Most Recent Transactions</h2>
        {transactions.slice(0, 5).map((txn) => (
          <div key={txn._id} className={`transaction-item ${txn.amount < 0 ? 'income' : 'expense'}`}>
            <div className="transaction-info">
              <strong>{txn.description}</strong>
              <span className="transaction-category">{txn.category}</span>
              <span className="transaction-date">
                {new Date(txn.date).toLocaleDateString()}
              </span>
            </div>
            <div className={`transaction-amount ${txn.amount < 0 ? 'income-amount' : 'expense-amount'}`}>
              ₹{Math.abs(txn.amount).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
