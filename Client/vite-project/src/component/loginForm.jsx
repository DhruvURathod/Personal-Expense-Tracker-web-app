import { useState } from "react";
import './loginForm.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page refresh
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password
      });

      // Save token to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Redirect to dashboard or homepage
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err.response?.data?.msg || err.message);
      alert('Login failed. Check your credentials.');
    }
  };

  return (

     <div className="form">
    
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="heading">Login</h2>
        
        <div className="form-group">
          <label className="heading1">Email</label>
          
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
          <label className="heading1">Password</label>
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
          Login
        </button>
      </form>
      <div className="signup-link-container" style={{ textAlign: 'center', marginTop: '16px' }}>
        <span style={{ color: '#334155' }}>Don't have an account? </span>
        <span
          style={{ color: '#0ea5e9', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => navigate('/signup')}
        >
          Sign up
        </span>
      </div>
      </div>
  );
}
