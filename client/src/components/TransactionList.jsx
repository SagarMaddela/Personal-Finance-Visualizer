import axios from "axios";
import "../styles/list.css";

export default function TransactionList({ transactions, fetchTransactions, setEditingData }) {
  const handleDelete = async (id) => {
    await axios.delete(`https://personal-finance-visualizer-api.onrender.com/api/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      <div className="transaction-list-container">
        {transactions.map((txn) => (
          <div key={txn._id} className="transaction-item">
            <div>
              <strong>{txn.description}</strong> - ₹{txn.amount} on{" "}
              {new Date(txn.date).toLocaleDateString()}
              <div className="transaction-category">
                <em>Category:</em> {txn.category}
              </div>
            </div>
            <div className="transaction-item-btn-group">
              <button onClick={() => setEditingData(txn)}>Edit</button>
              <button onClick={() => handleDelete(txn._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
