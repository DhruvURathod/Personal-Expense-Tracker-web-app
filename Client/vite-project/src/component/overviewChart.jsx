import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as PieTooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import './overviewChart.css';

// ---------- Pie Chart for Financial Overview ----------
export function FinancialPieChart({ pieData, pieColors, balance }) {
  return (
    <div className="dashboard-finance-card">
      <div className="dashboard-finance-title">Financial Overview</div>
      <div className="dashboard-finance-chart">
      <ResponsiveContainer width="100%" height={250}>
  <PieChart>
    <Pie
      data={pieData}
      dataKey="value"
      nameKey="name"
      cx="50%"          // center horizontally
      cy="60%"          // push down to make room for arc
      innerRadius={60}
      outerRadius={100}
      startAngle={180}
      endAngle={0}
      paddingAngle={2}
      height={260}
    >
      {pieData.map((entry, idx) => (
        <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
      ))}
    </Pie>
    <PieTooltip formatter={v => `₹${v}`} />
  </PieChart>
</ResponsiveContainer>
        <div className="dashboard-finance-center">
          <div className="dashboard-finance-balance">
            {balance >= 0 ? `₹${balance}` : `-₹${Math.abs(balance)}`}
          </div>
          <div className="dashboard-finance-balance-label">Total Balance</div>
        </div>
      </div>
      <div className="dashboard-finance-legend">
        <span>
          <span className="dashboard-legend-dot" style={{ background: '#8884d8' }}></span> Total Balance
        </span>
        <span>
          <span className="dashboard-legend-dot" style={{ background: '#ef4444' }}></span> Total Expenses
        </span>
        <span>
          <span className="dashboard-legend-dot" style={{ background: '#f97316' }}></span> Total Income
        </span>
      </div>
    </div>
  );
}

// ---------- Bar Chart for Income ----------
export function IncomeBarChart({ transactions }) {
  const incomeData = Object.entries(
    transactions
      .filter((t) => t.type === "income")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {})
  ).map(([category, amount]) => ({ category, amount }));

  return (
    <div className="dashboard-income-chart-card">
      <div className="dashboard-income-chart-title">Income (Last 30 Days)</div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={incomeData}>
          <XAxis dataKey="category" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} />
          <Tooltip formatter={(v) => `₹${v}`} />
          <Bar dataKey="amount" fill="#a78bfa" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- Donut Chart for Expenses ----------
export function ExpenseDonutChart({ transactions, pieColors }) {
  const expenseData = Object.entries(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
        return acc;
      }, {})
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="dashboard-expense-chart-card">
      <div className="dashboard-expense-chart-title">Expenses (Last 30 Days)</div>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={expenseData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="55%"
            innerRadius={40}
            outerRadius={65}
            label
          >
            {expenseData.map((entry, idx) => (
              <Cell key={`cell-expense-${idx}`} fill={pieColors[idx % pieColors.length]} />
            ))}
          </Pie>
          <PieTooltip formatter={(v) => `₹${v}`} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
