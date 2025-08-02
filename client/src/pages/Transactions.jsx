import { useEffect, useState } from "react";
import api from "../../api";
import TransactionList from "../components/TransactionList";
import ExpenseChart from "../components/ExpenseChart";
import TransactionForm from "../components/TransactionForm";
import SearchFilter from "../components/SearchFilter";
import ReceiptUpload from "../components/ReceiptUpload";
import Loader from "../components/Loader";
import "../index.css";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [chartPage, setChartPage] = useState(1);
  const [listPage, setListPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    startDate: "",
    endDate: ""
  });

  const chartItemsPerPage = 6; // Number of months to show per page
  const listItemsPerPage = 5; // Number of transactions to show per page

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/transactions");
      setTransactions(res.data);
      setFilteredTransactions(res.data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Apply filters to transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter(tx => tx.category === filters.category);
    }

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(tx => 
        new Date(tx.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(tx => 
        new Date(tx.date) <= new Date(filters.endDate)
      );
    }

    setFilteredTransactions(filtered);
    setListPage(1); // Reset to first page when filters change
  }, [transactions, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  // Filter only expenses (positive amounts) for the chart
  const expenses = filteredTransactions.filter(tx => tx.amount > 0);

  // Prepare chart data with pagination
  const chartData = {};
  expenses.forEach(tx => {
    const month = new Date(tx.date).toLocaleString("default", { month: "short", year: "numeric" });
    chartData[month] = (chartData[month] || 0) + tx.amount;
  });

  const chartDataArray = Object.entries(chartData).map(([month, total]) => ({ month, total }));
  const totalChartPages = Math.ceil(chartDataArray.length / chartItemsPerPage);
  const startChartIndex = (chartPage - 1) * chartItemsPerPage;
  const endChartIndex = startChartIndex + chartItemsPerPage;
  const currentChartData = chartDataArray.slice(startChartIndex, endChartIndex);

  // Prepare transaction list with pagination
  const totalListPages = Math.ceil(filteredTransactions.length / listItemsPerPage);
  const startListIndex = (listPage - 1) * listItemsPerPage;
  const endListIndex = startListIndex + listItemsPerPage;
  const currentTransactions = filteredTransactions.slice(startListIndex, endListIndex);

  if (loading) {
    return <Loader size="large" text="Loading transactions..." />;
  }

  return (
    <div className="container">
      <div className="left-container">
        <ExpenseChart 
          transactions={currentChartData.map(item => ({ 
            date: item.month, 
            amount: item.total 
          }))} 
          currentPage={chartPage}
          totalPages={totalChartPages}
          onPageChange={setChartPage}
        />
        <TransactionForm
          fetchTransactions={fetchTransactions}
          editingData={editingData}
          setEditingData={setEditingData}
        />
        <ReceiptUpload fetchTransactions={fetchTransactions} />
      </div>
      <div className="right-container">
        <SearchFilter onFilterChange={handleFilterChange} />
        <TransactionList
          transactions={currentTransactions}
          fetchTransactions={fetchTransactions}
          setEditingData={setEditingData}
          currentPage={listPage}
          totalPages={totalListPages}
          onPageChange={setListPage}
        />
      </div>
    </div>
  );
}
