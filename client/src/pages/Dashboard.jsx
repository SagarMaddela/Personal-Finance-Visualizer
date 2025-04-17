import { useEffect, useState } from "react";
import axios from "axios";
import PieChart from "../components/PieChart";
import "../styles/dashboard.css";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await axios.get("https://personal-finance-visualizer-api.onrender.com/api/transactions");
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
  
  // Now compute total for the month
  const totalExpense = monthlyTransactions.reduce((sum, txn) => sum + Number(txn.amount), 0);

  
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>DASHBOARD</h1>
      <div className="dashboard-top-container">
        <div className="expense-summary">
            <h2>Total Expenses</h2>
            <h2>₹{totalExpense}</h2>
        </div>
        <PieChart transactions={transactions} />
      </div>
      <div className="recent-transactions">
        <h2>Most Recent Transactions</h2>
        {transactions.slice(0, 5).map((txn) => (
          <div key={txn._id} className="transaction-item">
            <div>
              <strong>{txn.description}</strong> - ₹{txn.amount} on{" "}
              {new Date(txn.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
