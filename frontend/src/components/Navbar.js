import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const dashboardLink =
    user?.role === 'admin' ? '/admin' :
    user?.role === 'doctor' ? '/doctor/dashboard' : '/dashboard';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🏥 MediBook
      </Link>
      <div className="navbar-links">
        <Link to="/doctors">Find Doctors</Link>
        {user ? (
          <>
            <Link to={dashboardLink}>Dashboard</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
