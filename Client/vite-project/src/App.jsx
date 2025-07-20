import { useState } from 'react'
import './App.css'
import LoginForm from './component/loginForm'
import SignUpForm from './component/signUpForm'
import Navbar from './component/navbar'
import Cards from './component/cards'
import Dashboard from './component/dashboard'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TransactionForm from './component/transactionForm'
import Income from './component/income'
import Expense from './component/expense'
import PrivateRoute from './component/PrivateRoute';
import { FaHome } from 'react-icons/fa'

export default function App() {
  return (

    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/income" element={<PrivateRoute><Income /></PrivateRoute>} />
        <Route path="/expense" element={<PrivateRoute><Expense /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}


