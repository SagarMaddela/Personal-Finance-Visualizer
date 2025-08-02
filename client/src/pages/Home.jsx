import { useEffect, useState } from "react";
import api from "../../api";
import TransactionList from "../components/TransactionList";
import ExpenseChart from "../components/ExpenseChart";
import TransactionForm from "../components/TransactionForm";
import "../index.css";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editingData, setEditingData] = useState(null);
  const [chartPage, setChartPage] = useState(1);
  const [listPage, setListPage] = useState(1);

  const chartItemsPerPage = 6; // Number of months to show per page
  const listItemsPerPage = 8; // Number of transactions to show per page

  const fetchTransactions = async () => {
    const res = await api.get("/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Filter only expenses (positive amounts) for the chart
  const expenses = transactions.filter(tx => tx.amount > 0);

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
  const totalListPages = Math.ceil(transactions.length / listItemsPerPage);
  const startListIndex = (listPage - 1) * listItemsPerPage;
  const endListIndex = startListIndex + listItemsPerPage;
  const currentTransactions = transactions.slice(startListIndex, endListIndex);

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
      </div>
      <div className="right-container">
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
