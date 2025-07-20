// src/components/ExpenseChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

import './expenseChart.css';

export default function ExpenseChart({ expenses }) {
  // Prepare chart data
  const chartData = expenses.map(txn => ({
    date: txn.date ? new Date(txn.date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short"
    }) : "",
    amount: Number(txn.amount)
  }));

  return (
    <div style={{ width: '100%', height: 300, marginTop: 40 }} className="expense-chart-container">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} />
          <Tooltip formatter={(value) => `₹${value}`} />
          <Legend />
          <Line
            type="monotone"
            dataKey="amount"
            name="Expenses"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
