// Expense.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import TransactionForm from "./transactionForm";
import Navbar from "./navbar";
import Modal from "./Modal";
import { FaEdit, FaTrash, FaArrowDown } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import "./expense.css";
import ExpenseChart from "./expenseChart";
import { getCategoryIcon } from "../utils/helpers";

export default function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(res.data.filter((t) => t.type === "expense"));
    } catch (err) {
      setError("Failed to fetch expenses");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleAdd = async () => {
    setShowForm(false);
    await fetchExpenses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExpenses(expenses.filter((txn) => txn._id !== id));
    } catch (err) {
      alert("Failed to delete expense");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${import.meta.env.VITE_API_URL}/transactions/${editTxn._id}`, editTxn, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setEditTxn(null);
      await fetchExpenses();
    } catch (err) {
      alert("Failed to update expense");
    }
  };

  const handleEditChange = (e) => {
    setEditTxn({ ...editTxn, [e.target.name]: e.target.value });
  };


  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="expense-main-content">
        <div className="expense-section">
          <div className="expense-section-header">
            <div>
              <h2 className="expense-section-title">Expense Overview</h2>
              <div className="expense-section-desc">Track your spending and analyze your expense trends.</div>
            </div>
            <button onClick={() => setShowForm(true)} className="expense-add-btn">+ Add Expense</button>
          </div>
          {showForm && (
            <Modal onClose={() => setShowForm(false)}>
              <TransactionForm onAdd={handleAdd} onClose={() => setShowForm(false)} />
            </Modal>
          )}
          <div className="expense-chart-container">
            <ExpenseChart expenses={expenses} />
          </div>
        </div>
        <div className="dashboard-transaction-card">
          <h2 className="dashboard-transaction-title">Your Expenses</h2>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div style={{ color: "red" }}>{error}</div>
          ) : expenses.length === 0 ? (
            <div style={{textAlign: 'center', padding: '2rem 0'}}>
              <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No expense" style={{width: '90px', opacity: 0.7, marginBottom: '1rem'}} />
              <div style={{color: '#888', fontSize: '1.1rem', marginTop: '0.5rem'}}>No expenses yet! Start by adding your first expense transaction.</div>
            </div>
          ) : (
            <ul className="expense-list">
              {expenses.map((txn) => (
                <li key={txn._id} className="expense-item">
                  {editTxn && editTxn._id === txn._id ? (
                    <form onSubmit={handleUpdate} className="expense-edit-form" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <FaArrowDown className="expense-icon" />
                      <input
                        type="number"
                        name="amount"
                        value={editTxn.amount}
                        onChange={handleEditChange}
                        className="expense-amount"
                        style={{ width: 90 }}
                      />
                      <input
                        type="date"
                        name="date"
                        value={editTxn.date ? editTxn.date.slice(0, 10) : ""}
                        onChange={handleEditChange}
                        className="expense-date"
                      />
                      <button type="submit" className="editForm-btn">
                        Save
                      </button>
                      <button type="button" className="editForm-btn" onClick={() => setEditTxn(null)} >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <FaArrowDown className="expense-icon" />
                        <span className="expense-amount">₹{txn.amount}</span>
                      </div>
                      <span className="expense-date">{txn.date ? txn.date.slice(0, 10) : ""}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <button
                          onClick={() => setEditTxn(txn)}
                          className="dashboard-edit-btn"
                          title="Edit"
                        >
                          <FaEdit color="#8884d8" />
                        </button>
                        <button
                          onClick={() => handleDelete(txn._id)}
                          className="dashboard-delete-btn"
                          title="Delete"
                        >
                          <FaTrash color="#ed1e1e" />
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
