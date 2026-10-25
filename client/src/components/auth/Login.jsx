import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, KeyRound, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(email.trim(), password);
      setIsSubmitting(false);

      // Route strictly based on authenticated role
      if (user.role === 'HR') {
        navigate('/hr');
      } else if (user.role === 'Manager') {
        navigate('/manager');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        {/* Secure, Clean Login Card matching professional standards */}
        <div className="auth-card">
          <div className="auth-card-header">
            <h2 className="auth-title">HRM Portal Login</h2>
            <p className="auth-subtitle">Sign in to access your secure StaffSync portal</p>
          </div>

          {error && (
            <div className="auth-alert error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Work Email</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="label-row-between">
                <label htmlFor="login-password">Password</label>
              </div>
              <div className="input-with-icon">
                <KeyRound size={16} className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-auth-submit" disabled={isSubmitting}>
              <LogIn size={16} />
              <span>{isSubmitting ? 'Verifying Credentials...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="auth-footer">
            <p>
              New to StaffSync?{' '}
              <Link to="/register" className="auth-link">
                Register an Account
              </Link>
            </p>
            <Link to="/" className="back-home-link">
              ← Back to Landing Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
