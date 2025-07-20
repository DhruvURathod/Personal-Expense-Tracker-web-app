import React, { useState, useEffect } from "react";
import axios from "axios";
import Cards from "./cards";
import Navbar from "./navbar";
import TransactionForm from "./transactionForm";
import Modal from "./Modal";
import TransactionList from "./transactionList";
import { FinancialPieChart, IncomeBarChart, ExpenseDonutChart } from "./overviewChart";
import { getCategoryIcon, formatDate } from "../utils/helpers";
import {
  FaWallet,
  FaArrowUp,
  FaArrowDown,
  FaEdit,
  FaTrash,
  FaShoppingBag,
  FaPlane,
  FaLightbulb,
  FaHome,
  FaBus,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer as PieResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar
} from "recharts";
import "./dashboard.css";

// Category to icon mapping
const categoryIcons = {
  shopping: <FaShoppingBag style={{ color: '#a78bfa', fontSize: 22 }} />,
  travel: <FaPlane style={{ color: '#38bdf8', fontSize: 22 }} />,
  electricitybill: <FaLightbulb style={{ color: '#fde047', fontSize: 22 }} />,
  loanrepayment: <FaHome style={{ color: '#fbbf24', fontSize: 22 }} />,
  transport: <FaBus style={{ color: '#f472b6', fontSize: 22 }} />,
  // Add more as needed
};

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editTxn, setEditTxn] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      setError("Failed to fetch transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAdd = async () => {
    setShowForm(false);
    await fetchTransactions();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(transactions.filter((txn) => txn._id !== id));
    } catch (err) {
      alert("Failed to delete transaction");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/transactions/${editTxn._id}`,
        editTxn,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditTxn(null);
      await fetchTransactions();
    } catch (err) {
      alert("Failed to update transaction");
    }
  };

  const handleEditChange = (e) => {
    setEditTxn({ ...editTxn, [e.target.name]: e.target.value });
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  const pieData = [
    { name: "Total Balance", value: balance },
    { name: "Total Expenses", value: totalExpense },
    { name: "Total Income", value: totalIncome },
  ];
  const pieColors = ["#8884d8", "#ef4444", "#f97316"];

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-content">
        {/* Summary Cards */}
        <div className="dashboard-summary-cards">
          <Cards title="Total Balance" value={balance} icon={<FaWallet />} color="#7c3aed" />
          <Cards title="Total Income" value={totalIncome} icon={<FaArrowUp />} color="#f97316" />
          <Cards title="Total Expenses" value={totalExpense} icon={<FaArrowDown />} color="#ef4444" />
        </div>

        {/* Main Row - Charts and Add Button */}
        <div className="dashboard-main-row">
          {/* Recent Transactions + Add */}
          <div className="dashboard-recent-card">
            <div className="dashboard-recent-header">
              <span className="dashboard-recent-title">Recent Transactions</span>
              <button onClick={() => setShowForm(true)} className="dashboard-add-btn">
                Add Transaction
              </button>
            </div>
            {showForm && (
              <Modal onClose={() => setShowForm(false)}>
                <TransactionForm onAdd={handleAdd} onClose={() => setShowForm(false)} />
              </Modal>
            )}
            <ul className="dashboard-recent-list">
              {transactions.length === 0 ? (
                <li className="dashboard-recent-empty">No transactions found.</li>
              ) : (
                [...transactions]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 5)
                  .map((txn) => (
                    <li key={txn._id} className="dashboard-recent-item">
                      <div className="dashboard-recent-category-icon">{getCategoryIcon(txn.category)}</div>
                      <div className="dashboard-recent-info">
                        <div className="dashboard-recent-category">{txn.category}</div>
                        <div className="dashboard-recent-date">{new Date(txn.date).toLocaleDateString()}</div>
                      </div>
                      <div className={txn.type === "income" ? "dashboard-recent-amount dashboard-recent-income" : "dashboard-recent-amount dashboard-recent-expense"}>
                        {txn.type === "income" ? "+" : "-"}₹{txn.amount}
                      </div>
                    </li>
                  ))
              )}
            </ul>
          </div>

          {/* Financial Pie Chart Overview */}
          <FinancialPieChart pieData={pieData} pieColors={pieColors} balance={balance} />
        </div>

        {/* Secondary Row: Lists + Charts */}
        <div className="dashboard-secondary-row">
          {/* Left: Income & Expense Lists */}
          <div className="dashboard-lists-col">
            <TransactionList transactions={transactions} type="income" />
            <TransactionList transactions={transactions} type="expense" />
          </div>

          {/* Right: Bar and Donut Charts */}
          <div className="dashboard-charts-col">
            <IncomeBarChart transactions={transactions} />
            <ExpenseDonutChart transactions={transactions} pieColors={pieColors} />
          </div>
        </div>
      </div>
    </div>
  );
}
