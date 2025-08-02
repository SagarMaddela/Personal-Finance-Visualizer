import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import '../styles/chart.css';

export default function ExpenseChart({ transactions, currentPage = 1, totalPages = 1, onPageChange }) {
  const chartData = transactions.map(tx => ({ 
    month: new Date(tx.date).toLocaleString("default", { month: "short", year: "numeric" }), 
    total: tx.amount 
  }));

  return (
    <div className="chart-container">
      <h2>Monthly Expenses</h2>
      
      {chartData.length === 0 ? (
        <div className="no-data-message">
          <h3>No Monthly Expenses</h3>
          <p>No expense data available for the selected period.</p>
          <p className="no-data-hint">Add some transactions to see your monthly expense trends here.</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#2e86de" />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Chart Pagination */}
          {totalPages > 1 && (
            <div className="chart-pagination">
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
        </>
      )}
    </div>
  );
}
