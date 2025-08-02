import { useState } from "react";
import "../styles/search.css";

export default function SearchFilter({ onFilterChange }) {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    applyFilters(e.target.value, startDate, endDate);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    applyFilters(categoryFilter, e.target.value, endDate);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    applyFilters(categoryFilter, startDate, e.target.value);
  };

  const handleClearFilters = () => {
    setCategoryFilter("");
    setStartDate("");
    setEndDate("");
    applyFilters("", "", "");
  };

  const applyFilters = (category, start, end) => {
    onFilterChange({
      description: "",
      category: category,
      startDate: start,
      endDate: end
    });
  };

  return (
    <div className="search-filter">
      <h3>Search & Filter</h3>
      <div className="filter-controls">
        <div className="filter-group">
          <label htmlFor="category-filter">Category:</label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={handleCategoryChange}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="start-date">From Date:</label>
          <input
            id="start-date"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="end-date">To Date:</label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={handleEndDateChange}
            className="filter-input"
          />
        </div>

        <button 
          onClick={handleClearFilters}
          className="clear-filters-btn"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 