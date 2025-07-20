// src/components/TransactionForm.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  FaArrowUp,
  FaArrowDown,
  FaShoppingBag,
  FaPlane,
  FaLightbulb,
  FaHome,
  FaBus,
  FaWallet
} from "react-icons/fa";
import "./transactionForm.css";

export default function TransactionForm({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    date: new Date().toISOString().split("T")[0], // default to today
    category: "Shopping",
    note: ""
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.date || !formData.category) {
      alert("Please fill in all required fields");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/transactions`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onAdd(); // Refresh or re-fetch transactions
    } catch (err) {
      alert("Failed to add transaction");
    }
  };

  return (
    <div className="transaction-form-container">
      {/* Modal Header */}
      <div className="transaction-form-header">
        <h3>Add New Transaction</h3>
      </div>

      {/* Transaction Form */}
      <form className="transaction-form" onSubmit={handleSubmit}>
        {/* Transaction Type */}
        <div className="form-group">
          <label className="form-label">Transaction Type</label>
          <div className="type-selector">
            <button
              type="button"
              className={`type-btn ${
                formData.type === "income" ? "active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "income" }))
              }
            >
              Income
            </button>
            <button
              type="button"
              className={`type-btn ${
                formData.type === "expense" ? "active" : ""
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, type: "expense" }))
              }
            >
              Expense
            </button>
          </div>
        </div>

        {/* Amount */}
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="Shopping">Shopping</option>
            <option value="Salary">Salary</option>
            <option value="Travel">Travel</option>
            <option value="Electricity Bill">Electricity Bill</option>
            <option value="Loan Repayment">Loan Repayment</option>
            <option value="Transport">Transport</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Form Buttons */}
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="submit-btn">
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
}
