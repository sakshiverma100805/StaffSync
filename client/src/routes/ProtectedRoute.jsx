import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft, LogOut } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verifying StaffSync Authorization & Session...</p>
      </div>
    );
  }

  // Not logged in -> Redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role validation: if user's role is not in the allowedRoles list, STRICTLY DENY access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const designatedPath =
      user.role === 'HR' ? '/hr' : user.role === 'Manager' ? '/manager' : '/employee';

    return (
      <div className="access-denied-wrapper">
        <div className="access-denied-card">
          <div className="access-denied-icon">
            <ShieldAlert size={48} className="text-rose" />
          </div>
          <h2 className="access-denied-title">403 — Access Denied</h2>
          <p className="access-denied-msg">
            Your account is assigned the role of <strong className="text-blue">{user.role}</strong>.
            You do not have administrative clearance to access this portal ({location.pathname}).
          </p>
          <div className="access-denied-user-box">
            <span className="denied-user-label">Current Authenticated User:</span>
            <span className="denied-user-val">{user.name} ({user.email})</span>
          </div>
          <div className="access-denied-actions">
            <Link to={designatedPath} className="btn-blue-submit">
              <ArrowLeft size={16} /> Return to Your {user.role} Portal
            </Link>
            <button
              type="button"
              onClick={logout}
              className="btn-portal-logout"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
