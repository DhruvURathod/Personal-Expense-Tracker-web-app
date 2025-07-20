// src/components/TransactionList.jsx
import React from "react";
import { FaArrowUp, FaArrowDown, FaHome } from "react-icons/fa";
import { getCategoryIcon, formatDate } from "../utils/helpers";
import { FaPlane } from "react-icons/fa";


export default function TransactionList({ transactions, type }) {
  const filtered = transactions
    .filter((t) => t.type === type)
    .slice(0, 5);

  return (
    <div className={`dashboard-${type}-card`}>
      <div className={`dashboard-${type}-header`}>
        {type === "income" ? "Income" : "Expenses"}
      </div>
      <ul className={`dashboard-${type}-list`}>
        {filtered.length === 0 ? (
          <li style={{textAlign: 'center', color: '#888', padding: '1.5rem 0'}}>
            {type === 'income' ? 'No income found.' : 'No expense found.'}
          </li>
        ) : (
          filtered.map((txn) => (
            <li key={txn._id} className={`dashboard-${type}-item`}>
                <div className="dashboard-recent-icon">{getCategoryIcon(txn.category)}</div>
              <div className="dashboard-recent-info">
                <div className="dashboard-recent-category">{txn.category || "Other"}</div>
                <div className="dashboard-recent-date">{formatDate(txn.date)}</div>
              </div>
              <div
                className={`dashboard-${type}-amount`}
              >
                {type === "income" ? "+" : "-"}₹{txn.amount}
                {type === "income" ? (
                  <FaArrowUp style={{ marginLeft: 4, color: "#22c55e" }} />
                ) : (
                  <FaArrowDown style={{ marginLeft: 4, color: "#ef4444" }} />
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
