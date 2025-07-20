import { useState } from "react";
import './signUpForm.css'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUpForm() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, {
        userName,
        email,
        password
      });

      // Save JWT to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Signup error:', err.response?.data?.msg || err.message);
      alert('Signup failed. Try again.');
    }
  };

  return (

    <div className="form">
    
      <form className="signUp-form" onSubmit={handleSubmit}>
        <h2 className="heading">Sign Up</h2>

        <div className="form-group">
          <label htmlFor="userName">Username</label>
          
          <input
            id="userName"
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        

        <div className="form-group">
          <label htmlFor="email">Email</label>
          
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        

        <button className="submit-btn" type="submit">
          Sign Up
        </button>
      </form>
      </div>
  );
}
