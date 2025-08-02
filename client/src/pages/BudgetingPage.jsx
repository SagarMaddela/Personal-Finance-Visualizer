import { useState, useEffect } from "react";
import api from "../../api";
import Loader from "../components/Loader";
import "../styles/budget.css";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const categories = ["Food", "Transport", "Entertainment", "Bills", "Shopping", "Other"];

export default function BudgetingPage() {
  const [budgets, setBudgets] = useState({});
  const [spending, setSpending] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Food");
  const [inputAmount, setInputAmount] = useState("");
  const [overspentInsights, setOverspentInsights] = useState([]);
  const [savedInsights, setSavedInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [budgetsRes, transactionsRes] = await Promise.all([
        api.get("/budgets"),
        api.get("/transactions")
      ]);
    
      const fetchedBudgets = budgetsRes.data;
      const transactions = transactionsRes.data;
    
      // Get current month and year
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
    
      // Filter transactions for the current month
      const monthlyTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        return txnDate.getMonth() === currentMonth && txnDate.getFullYear() === currentYear;
      });
    
      // Calculate totals per category
      const totals = {};
      monthlyTransactions.forEach(txn => {
        if (!totals[txn.category]) totals[txn.category] = 0;
        totals[txn.category] += Number(txn.amount);
      });
    
      setBudgets(fetchedBudgets);
      setSpending(totals);
      generateInsights(fetchedBudgets, totals);
    } catch (error) {
      console.error("Failed to fetch budget data:", error);
    } finally {
      setLoading(false);
    }
  };
  

  const generateInsights = (budgetsData, spendingData) => {
    const overspent = [];
    const saved = [];

    for (const cat of categories) {
      const spent = spendingData[cat] || 0;
      const limit = budgetsData[cat] || 0;

      if (spent > limit) {
        overspent.push(`⚠️ Overspent in ${cat} by ₹${spent - limit}`);
      } else if (limit > 0) {
        saved.push(`✅ Saved ₹${limit - spent} in ${cat}`);
      }
    }

    setOverspentInsights(overspent);
    setSavedInsights(saved);
  };

  const handleSave = async () => {
    const updated = { ...budgets, [selectedCategory]: Number(inputAmount) };
    await api.post("/budgets", updated);
    setInputAmount("");
    setSelectedCategory("Food");
    fetchData(); // refresh everything
  };

  const chartData = categories.map(cat => ({
    category: cat,
    Budget: budgets[cat] || 0,
    Spending: spending[cat] || 0,
  }));

  if (loading) {
    return <Loader size="large" text="Loading budget data..." />;
  }

  return (
    <div className="budget-container">
    <div className="budget-top-container">
    <div className="budget-editor">
      <div className="current-budgets">
        <h3>Current Budgets</h3>
        <ul>
          {categories.map(cat => (
            <li key={cat}>
              {cat}: ₹{budgets[cat] || 0}
            </li>
          ))}
        </ul>
      </div>

      <div className="budget-form">
        <h3>Edit Budget</h3>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="number"
          value={inputAmount}
          onChange={e => setInputAmount(e.target.value)}
          placeholder="Enter new amount"
        />
        <button onClick={handleSave}>Save Budget</button>
      </div>
    </div>

      <div className="insights-container">
        <h3>Insights Provider</h3>
        <div className="budget-insights">
          {/* <h3>⚠️ Overspent</h3> */}
          <ul>
            {overspentInsights.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
        <div className="split-insights">
          {/* <h3>✅ Saved</h3> */}
          <ul>
            {savedInsights.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>

      <div className="budget-chart">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Budget" fill="#8884d8" />
            <Bar dataKey="Spending" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <h1>Budget vs Spent</h1>
    </div>
  );
}
