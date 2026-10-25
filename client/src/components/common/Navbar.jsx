import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Users, LogOut, Shield, UserCheck, Briefcase } from 'lucide-react';

const Navbar = ({ portalTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'HR':
        return 'badge-role-hr';
      case 'Manager':
        return 'badge-role-manager';
      default:
        return 'badge-role-employee';
    }
  };

  const getPortalLink = (role) => {
    if (role === 'HR') return '/hr';
    if (role === 'Manager') return '/manager';
    return '/employee';
  };

  return (
    <header className="hrm-navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-left">
          <Link to={user ? getPortalLink(user.role) : '/'} className="navbar-brand">
            <div className="brand-icon">
              <Users size={22} className="text-blue" />
            </div>
            <div className="brand-text">
              <span className="brand-name">StaffSync</span>
              <span className="brand-sub">{portalTitle || 'HRM Portal'}</span>
            </div>
          </Link>
        </div>

        {/* Right side controls */}
        <div className="navbar-right">
          {user ? (
            <>
              {/* Authenticated User info */}
              <div className="user-profile-summary">
                <div className="user-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-meta">
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role-badge ${getRoleBadgeClass(user.role)}`}>
                    {user.role} Portal Access
                  </span>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="btn-portal-logout"
                title="Log out of your session"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="nav-auth-buttons">
              <Link to="/login" className="btn-login-outline">
                Login
              </Link>
              <Link to="/register" className="btn-primary-action">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
