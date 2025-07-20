import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./navbar";
import TransactionForm from "./transactionForm";
import Modal from "./Modal";
import { FaArrowUp, FaEdit, FaTrash } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./income.css";
import { getCategoryIcon } from "../utils/helpers";

export default function Income() {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editTxn, setEditTxn] = useState(null);

  // Fetch income transactions
  const fetchIncomes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIncomes(res.data.filter((t) => t.type === "income"));
    } catch (err) {
      setError("Failed to fetch incomes");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

    // Handle add income
    const handleAdd = async () => {
      setShowForm(false);
      await fetchIncomes();
    };
  
    // Handle delete
    const handleDelete = async (id) => {
      if (!window.confirm("Delete this income?")) return;
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${import.meta.env.VITE_API_URL}/transactions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIncomes(incomes.filter((txn) => txn._id !== id));
      } catch (err) {
        alert("Failed to delete income");
      }
    };
  
    // Handle update
    const handleUpdate = async (e) => {
      e.preventDefault();
      try {
        const token = localStorage.getItem("token");
        await axios.put(
          `${import.meta.env.VITE_API_URL}/transactions/${editTxn._id}`,
          editTxn,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setEditTxn(null);
        await fetchIncomes();
      } catch (err) {
        alert("Failed to update income");
      }
    };
  
    const handleEditChange = (e) => {
      setEditTxn({ ...editTxn, [e.target.name]: e.target.value });
    };



  // Chart data
  const chartData = incomes.map((txn) => ({
    date: txn.date ? new Date(txn.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "",
    amount: Number(txn.amount),
  }));

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="income-section">
        <div className="income-section-header">
          <div>
            <h2 className="income-section-title">Income Overview</h2>
            <div className="income-section-desc">Track your earnings over time and analyze your income trends.</div>
          </div>
          <button onClick={() => setShowForm(true)} className="income-add-btn">+ Add Income</button>
        </div>
        {showForm && (
          <Modal onClose={() => setShowForm(false)}>
            <TransactionForm onAdd={handleAdd} onClose={() => setShowForm(false)} />
          </Modal>
        )}
        <div className="income-chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 10 }}>
              <XAxis dataKey="date" tick={{ fontSize: 13 }} />
              <YAxis tick={{ fontSize: 13 }} />
              <Tooltip formatter={v => `₹${v}`} />
              <Bar dataKey="amount" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="dashboard-transaction-card">
        <h2 className="dashboard-transaction-title">Your Incomes</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : incomes.length === 0 ? (
          <div style={{textAlign: 'center', padding: '2rem 0'}}>
            <img src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png" alt="No income" style={{width: '90px', opacity: 0.7, marginBottom: '1rem'}} />
            <div style={{color: '#888', fontSize: '1.1rem', marginTop: '0.5rem'}}>No incomes yet! Start by adding your first income transaction.</div>
          </div>
        ) : (
          <ul className="income-list">
            {incomes.map((txn) => (
              <li key={txn._id} className="income-item">
                {editTxn && editTxn._id === txn._id ? (
                  <form onSubmit={handleUpdate} className="dashboard-edit-form" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FaArrowUp className="income-icon" />
                    <input
                      type="number"
                      name="amount"
                      value={editTxn.amount}
                      onChange={handleEditChange}
                      className="income-amount"
                      style={{ width: 90 }}
                    />
                    <input
                      type="date"
                      name="date"
                      value={editTxn.date ? editTxn.date.slice(0, 10) : ""}
                      onChange={handleEditChange}
                      className="income-date"
                    />
                    <button type="submit"  className="editForm1-btn">
                      Save
                    </button>
                    <button type="button" className="editForm1-btn"  onClick={() => setEditTxn(null)} >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    
                      <FaArrowUp className="income-icon" />
                      <span className="income-amount">₹{txn.amount}</span>
                    </div>
                    <span className="income-date">{txn.date ? txn.date.slice(0, 10) : ""}</span>
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
  );
}
