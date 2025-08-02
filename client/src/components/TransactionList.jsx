import api from "../../api";
import "../styles/list.css";

export default function TransactionList({ 
  transactions, 
  fetchTransactions, 
  setEditingData, 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) {
  const handleDelete = async (id) => {
    await api.delete(`/transactions/${id}`);
    fetchTransactions();
  };

  return (
    <div className="transaction-list">
      <h2>Transactions</h2>
      <div className="transaction-list-container">
        {transactions.length === 0 ? (
          <div className="no-transactions">
            <p>No transactions found matching your search criteria.</p>
            <p className="no-transactions-hint">Try adjusting your filters or adding new transactions.</p>
          </div>
        ) : (
          transactions.map((txn) => (
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
          ))
        )}
      </div>
      
      {/* Transaction List Pagination */}
      {totalPages > 1 && (
        <div className="list-pagination">
          <button 
            onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
