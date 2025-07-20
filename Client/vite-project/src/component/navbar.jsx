import { useEffect, useState } from "react";
import './navbar.css';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa"; // Import icons
import defaultAvatar from '../utils/Avatar-Boy.png';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <div className="navbar-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
      {menuOpen && <div className="navbar-backdrop" onClick={() => setMenuOpen(false)}></div>}
      <div className={`navbar${menuOpen ? " open" : ""}`}>
        <div className="navbar-user-info">
          <img
            className="navbar-user-avatar"
            src={user && user.avatar ? user.avatar : defaultAvatar}
            alt="User Avatar"
          />
          <div className="navbar-user-name">
            {/* {user ? user.name : "Loading..."} */}
          </div>
        </div>
        <Link to="/dashboard" className="btn1" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        <Link to="/income" className="btn2" onClick={() => setMenuOpen(false)}>Income</Link>
        <Link to="/expense" className="btn3" onClick={() => setMenuOpen(false)}>Expense</Link>
        <div className="btn4" onClick={() => { setMenuOpen(false); handleLogout(); }}>Logout</div>
      </div>
    </>
  );
}
