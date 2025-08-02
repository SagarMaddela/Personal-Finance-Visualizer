import { useState } from "react";
import api from "../../api";
import "../styles/receipt.css";

const CATEGORIES = [
  "Food", "Transport", "Entertainment", "Shopping", "Bills", 
  "Healthcare", "Education", "Salary", "Investment", "Other"
];

export default function ReceiptUpload({ fetchTransactions }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedItems, setExtractedItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await api.post('/receipts/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setExtractedItems(response.data.extractedItems);
        setShowResults(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCategoryChange = (index, category) => {
    const updatedItems = [...extractedItems];
    updatedItems[index].category = category;
    setExtractedItems(updatedItems);
  };

  const handleDescriptionChange = (index, description) => {
    const updatedItems = [...extractedItems];
    updatedItems[index].description = description;
    setExtractedItems(updatedItems);
  };

  const handleAmountChange = (index, amount) => {
    const updatedItems = [...extractedItems];
    updatedItems[index].amount = parseFloat(amount) || 0;
    setExtractedItems(updatedItems);
  };

  const handleDeleteItem = (index) => {
    const updatedItems = extractedItems.filter((_, i) => i !== index);
    setExtractedItems(updatedItems);
  };

  const handleAddTransactions = async () => {
    try {
      const validItems = extractedItems.filter(item => 
        item.description && item.amount > 0 && item.category
      );

      if (validItems.length === 0) {
        setError("Please fill in all required fields for at least one item");
        return;
      }

      // Add each item as a transaction
      for (const item of validItems) {
        await api.post('/transactions', {
          description: item.description,
          amount: item.amount,
          category: item.category,
          date: selectedDate
        });
      }

      // Reset form
      setFile(null);
      setExtractedItems([]);
      setShowResults(false);
      setSelectedDate(new Date().toISOString().split('T')[0]);
      setError("");
      
      // Refresh transactions list
      fetchTransactions();
      
      // alert(`Successfully added ${validItems.length} transaction(s)!`);
    } catch (err) {
      setError("Error adding transactions");
    }
  };

  const handleCancel = () => {
    setFile(null);
    setExtractedItems([]);
    setShowResults(false);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setError("");
  };

  return (
    <div className="receipt-upload">
      <h3>Upload Receipt</h3>
      
      {!showResults ? (
        <div className="upload-section">
          <div className="file-input-container">
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="file-input"
              id="receipt-file"
            />
            <label htmlFor="receipt-file" className="file-label">
              {file ? file.name : "Choose Image or PDF"}
            </label>
          </div>
          
          {file && (
            <button 
              onClick={handleUpload}
              disabled={isUploading}
              className="upload-btn"
            >
              {isUploading ? "Processing..." : "Process Receipt"}
            </button>
          )}
          
          {error && <p className="error-message">{error}</p>}
        </div>
      ) : (
        <div className="results-section">
          <div className="date-selector">
            <label htmlFor="transaction-date">Transaction Date:</label>
            <input
              type="date"
              id="transaction-date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
            />
          </div>

          <div className="extracted-items">
            <h4>Extracted Items</h4>
            <p className="instructions">
              Review and edit the extracted items. Fill in the category for each item before adding. You can delete items you don't want to include.
            </p>
            
            <div className="items-table">
              <div className="table-header">
                <span>Description</span>
                <span>Amount (₹)</span>
                <span>Category</span>
                <span>Action</span>
              </div>
              
              {extractedItems.map((item, index) => (
                <div key={index} className="table-row">
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    className="description-input"
                    placeholder="Item description"
                  />
                  <input
                    type="number"
                    value={item.amount}
                    onChange={(e) => handleAmountChange(index, e.target.value)}
                    className="amount-input"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                  <select
                    value={item.category}
                    onChange={(e) => handleCategoryChange(index, e.target.value)}
                    className="category-select"
                  >
                    <option value="">Select Category</option>
                    {CATEGORIES.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDeleteItem(index)}
                    className="delete-item-btn"
                    title="Delete this item"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            {extractedItems.length === 0 && (
              <p className="no-items-message">No items to display. Try uploading a different receipt.</p>
            )}
          </div>

          <div className="action-buttons">
            <button 
              onClick={handleAddTransactions} 
              className="add-btn"
              disabled={extractedItems.length === 0}
            >
              Add Transactions
            </button>
            <button onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
          
          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
} 