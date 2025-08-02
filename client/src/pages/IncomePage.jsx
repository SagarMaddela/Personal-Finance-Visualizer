import { useState, useEffect } from "react";
import api from "../../api";
import Loader from "../components/Loader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/income.css";

const incomeCategories = ["Salary", "Freelance", "Investment", "Business", "Other"];

export default function IncomePage() {
  const [incomes, setIncomes] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: "",
    category: "",
  });
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [chartPage, setChartPage] = useState(1);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    monthlyIncome: 0,
    yearlyIncome: 0,
    monthlyChange: 0,
  });

  const itemsPerPage = 3;
  const chartItemsPerPage = 8; // Number of months to show per page

  useEffect(() => {
    fetchIncomes();
  }, []);

  useEffect(() => {
    calculateSummary();
  }, [incomes]);

  const fetchIncomes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      // Filter only income transactions (negative amounts)
      const incomeTransactions = res.data.filter(tx => tx.amount < 0);
      setIncomes(incomeTransactions);
    } catch (error) {
      console.error("Error fetching incomes:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let monthlyIncome = 0;
    let yearlyIncome = 0;
    let previousMonthIncome = 0;

    incomes.forEach(income => {
      const incomeDate = new Date(income.date);
      const incomeAmount = Math.abs(income.amount); // Convert negative to positive for display

      // Current month income
      if (incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear) {
        monthlyIncome += incomeAmount;
      }

      // Current year income
      if (incomeDate.getFullYear() === currentYear) {
        yearlyIncome += incomeAmount;
      }

      // Previous month income
      if (incomeDate.getMonth() === previousMonth && incomeDate.getFullYear() === previousYear) {
        previousMonthIncome += incomeAmount;
      }
    });

    const monthlyChange = previousMonthIncome > 0 
      ? ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100 
      : 0;

    setSummary({
      monthlyIncome,
      yearlyIncome,
      monthlyChange: Math.round(monthlyChange * 100) / 100,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { description, amount, date, category } = formData;

    if (!description || !amount || !date || !category) {
      setError("Please fill out all fields.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    try {
      // Store income as negative amount in database
      const incomeData = {
        description,
        amount: -Math.abs(Number(amount)), // Ensure negative value
        date,
        category,
      };

      if (editingData) {
        await api.put(`/transactions/${editingData._id}`, incomeData);
        setEditingData(null);
      } else {
        await api.post("/transactions", incomeData);
      }

      setFormData({ description: "", amount: "", date: "", category: "" });
      fetchIncomes();
    } catch (err) {
      console.error("Error submitting income:", err);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleEdit = (income) => {
    setEditingData(income);
    setFormData({
      description: income.description,
      amount: Math.abs(income.amount).toString(), // Convert negative to positive for form
      date: income.date.slice(0, 10),
      category: income.category,
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      fetchIncomes();
    } catch (error) {
      console.error("Error deleting income:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingData(null);
    setFormData({ description: "", amount: "", date: "", category: "" });
  };

  // Prepare chart data with pagination
  const chartData = {};
  incomes.forEach(income => {
    const month = new Date(income.date).toLocaleString("default", { 
      month: "short", 
      year: "numeric" 
    });
    chartData[month] = (chartData[month] || 0) + Math.abs(income.amount);
  });

  const chartDataArray = Object.entries(chartData).map(([month, total]) => ({ 
    month, 
    total 
  }));

  // Chart pagination
  const totalChartPages = Math.ceil(chartDataArray.length / chartItemsPerPage);
  const startChartIndex = (chartPage - 1) * chartItemsPerPage;
  const endChartIndex = startChartIndex + chartItemsPerPage;
  const currentChartData = chartDataArray.slice(startChartIndex, endChartIndex);

  // List pagination
  const totalPages = Math.ceil(incomes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentIncomes = incomes.slice(startIndex, endIndex);

  if (loading) {
    return <Loader size="large" text="Loading income data..." />;
  }

  return (
    <div className="income-container">
      {/* Income Summary Section */}
      <div className="income-summary">
        <div className="summary-card">
          <h3>This Month</h3>
          <p className="summary-amount">₹{summary.monthlyIncome.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>This Year</h3>
          <p className="summary-amount">₹{summary.yearlyIncome.toLocaleString()}</p>
        </div>
        <div className="summary-card">
          <h3>Monthly Change</h3>
          <p className={`summary-change ${summary.monthlyChange >= 0 ? 'positive' : 'negative'}`}>
            {summary.monthlyChange >= 0 ? '+' : ''}{summary.monthlyChange}%
          </p>
        </div>
      </div>

      {/* Income Trend Chart */}
      <div className="income-chart">
        <h2>Income Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={currentChartData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#2e86de" />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Chart Pagination */}
        {totalChartPages > 1 && (
          <div className="chart-pagination">
            <button 
              onClick={() => setChartPage(prev => Math.max(prev - 1, 1))}
              disabled={chartPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {chartPage} of {totalChartPages}
            </span>
            <button 
              onClick={() => setChartPage(prev => Math.min(prev + 1, totalChartPages))}
              disabled={chartPage === totalChartPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Main Content - Form and List Side by Side */}
      <div className="income-main-content">
        {/* Left Container - Add Income Form */}
        <div className="income-left-container">
          <div className="income-form-section">
            <h2>{editingData ? "Edit Income" : "Add New Income"}</h2>
            <form className="income-form" onSubmit={handleSubmit}>
              {error && <div className="form-error">{error}</div>}
              <input
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                required
              />
              <input
                name="amount"
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={handleChange}
                required
              />
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {incomeCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <div className="form-buttons">
                <button type="submit">
                  {editingData ? "Update" : "Add"} Income
                </button>
                {editingData && (
                  <button type="button" onClick={handleCancelEdit} className="cancel-btn">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Container - Recent Income List */}
        <div className="income-right-container">
          <div className="income-list-section">
            <h2>Recent Income</h2>
            <div className="income-list">
              {currentIncomes.length === 0 ? (
                <p className="no-income">No income records found.</p>
              ) : (
                currentIncomes.map(income => (
                  <div key={income._id} className="income-item">
                    <div className="income-info">
                      <h4>{income.description}</h4>
                      <p className="income-category">{income.category}</p>
                      <p className="income-date">
                        {new Date(income.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="income-amount">
                      ₹{Math.abs(income.amount).toLocaleString()}
                    </div>
                    <div className="income-actions">
                      <button onClick={() => handleEdit(income)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(income._id)} className="delete-btn">
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 