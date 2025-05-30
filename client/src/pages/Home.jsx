import { useEffect, useState } from "react";
import axios from "axios";
import TransactionList from "../components/TransactionList";
import ExpenseChart from "../components/ExpenseChart";
import TransactionForm from "../components/TransactionForm";
import "../index.css";

export default function Home() {
  const [transactions, setTransactions] = useState([]);
  const [editingData, setEditingData] = useState(null);

  const fetchTransactions = async () => {
    const res = await axios.get("https://personal-finance-visualizer-api.onrender.com/api/transactions");
    setTransactions(res.data);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="container">
      <div className="left-container">
      <ExpenseChart transactions={transactions} />
      <TransactionForm
        fetchTransactions={fetchTransactions}
        editingData={editingData}
        setEditingData={setEditingData}
      />
      </div>
      <div className="right-container">
      <TransactionList
        transactions={transactions}
        fetchTransactions={fetchTransactions}
        setEditingData={setEditingData}
      />
      
      </div>
    </div>
  );
}
