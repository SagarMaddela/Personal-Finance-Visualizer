import { useState, useEffect } from "react";
import api from "../../api";
import "../styles/form.css";

export default function TransactionForm({ fetchTransactions, editingData, setEditingData }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: '',
    category: '',
  });
  

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingData) {
      setFormData({
        description: editingData.description,
        amount: editingData.amount,
        date: editingData.date.slice(0, 10),
        category: editingData.category,
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

    const { description, amount, date, category } = formData;

    const requestBody = { description, amount, date, category };
    console.log("Submitting transaction:", requestBody);


    // Validation
    if (!description || !amount || !date || !category) {
      setError("Please fill out all fields.");
      return;
    }

    if (Number(amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    try {
      if (editingData) {
        await api.put(`/transactions/${editingData._id}`, formData);
        setEditingData(null);
      } else {
        await api.post("/transactions", formData);
      }

      setFormData({ description: "", amount: "", date: "", category: "" });
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
      <label>Category:</label>
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Select</option>
        <option value="Food">Food</option>
        <option value="Transport">Transport</option>
        <option value="Entertainment">Entertainment</option>
        <option value="Bills">Bills</option>
        <option value="Shopping">Shopping</option>
        <option value="Other">Other</option>
      </select>

      <button type="submit">{editingData ? "Update" : "Add"} Transaction</button>
    </form>
    </div>
  );
}
