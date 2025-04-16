import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/form.css";

export default function TransactionForm({ fetchTransactions, editingData, setEditingData }) {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingData) {
      setFormData({
        description: editingData.description,
        amount: editingData.amount,
        date: editingData.date.slice(0, 10),
      });
    }
  }, [editingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { description, amount, date } = formData;

    // Validation
    if (!description || !amount || !date) {
      setError("Please fill out all fields.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    try {
      if (editingData) {
        await axios.put(`http://localhost:5000/api/transactions/${editingData._id}`, formData);
        setEditingData(null);
      } else {
        await axios.post("http://localhost:5000/api/transactions", formData);
      }

      setFormData({ description: "", amount: "", date: "" });
      fetchTransactions();
    } catch (err) {
      console.error("Error submitting form", err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="form-header">
      <h2>{editingData ? "Edit Transaction" : "Add Transaction"}</h2>
    <form className="transaction-form" onSubmit={handleSubmit}>
      {error && <div className="form-error">{error}</div>}
      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        name="amount"
        type="number"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
      />
      <input
        name="date"
        type="date"
        value={formData.date}
        onChange={handleChange}
      />
      <button type="submit">{editingData ? "Update" : "Add"} Transaction</button>
    </form>
    </div>
  );
}
