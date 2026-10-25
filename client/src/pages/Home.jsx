import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  CalendarCheck,
  Briefcase,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePortalRedirect = () => {
    if (!user) return;
    if (user.role === 'HR') navigate('/hr');
    else if (user.role === 'Manager') navigate('/manager');
    else navigate('/employee');
  };

  return (
    <div className="landing-page-wrapper">
      {/* Top Navigation Bar matching page 50 */}
      <nav className="landing-top-nav">
        <div className="nav-container">
          <div className="landing-brand">
            <div className="brand-logo-glow">
              <Users size={22} className="text-blue" />
            </div>
            <span className="landing-brand-title">HRM Portal</span>
          </div>

          <div className="landing-nav-links">
            {user ? (
              <div className="logged-in-badge-row">
                <span className="user-greeting">
                  Signed in as <strong>{user.name}</strong> ({user.role})
                </span>
                <button
                  type="button"
                  onClick={handlePortalRedirect}
                  className="btn-portal-primary"
                >
                  Enter {user.role} Portal <ArrowRight size={15} />
                </button>
              </div>
            ) : (
              <div className="auth-nav-group">
                <Link to="/login" className="btn-nav-outline">
                  Login
                </Link>
                <Link to="/register" className="btn-portal-primary">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section matching page 50 */}
      <section className="landing-hero-section">
        <div className="hero-glow-backdrop"></div>
        <div className="hero-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="text-blue" />
            <span>StaffSync Modern HRMS Solution</span>
          </div>

          <h1 className="hero-headline">
            Empower Your Workforce with <span className="gradient-text">HRM Portal</span>
          </h1>

          <p className="hero-subtext">
            A modern Human Resource Management platform designed to simplify attendance tracking,
            leave management, employee records, and communication across teams.
          </p>

          <div className="hero-cta-group">
            {user ? (
              <button
                type="button"
                onClick={handlePortalRedirect}
                className="btn-hero-primary"
              >
                Go to {user.role} Dashboard <ArrowRight size={18} />
              </button>
            ) : (
              <>
                <Link to="/register" className="btn-hero-primary">
                  Get Started <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn-hero-secondary">
                  Sign In to Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4 Feature Cards matching page 50 */}
      <section className="landing-features-section">
        <div className="section-container">
          <div className="features-grid">
            {/* Card 1 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-blue">
                <Users size={26} />
              </div>
              <h3 className="feature-title">Employee Management</h3>
              <p className="feature-desc">
                Manage employee records, department structures, salaries, and personnel profiles
                efficiently with comprehensive CRUD controls.
              </p>
            </div>

            {/* Card 2 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-green">
                <CalendarCheck size={26} />
              </div>
              <h3 className="feature-title">Attendance & Leave</h3>
              <p className="feature-desc">
                Track daily check-in / check-out times, view attendance logs, and manage digital
                leave applications with automated approval workflows.
              </p>
            </div>

            {/* Card 3 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-red">
                <Briefcase size={26} />
              </div>
              <h3 className="feature-title">HR & Manager Tools</h3>
              <p className="feature-desc">
                Role-based admin controls for handling department updates, publishing broadcast
                announcements, and reviewing team applications.
              </p>
            </div>

            {/* Card 4 */}
            <div className="feature-card">
              <div className="feature-icon-wrapper icon-purple">
                <TrendingUp size={26} />
              </div>
              <h3 className="feature-title">Employee Growth</h3>
              <p className="feature-desc">
                Interactive training program scheduling, trainer assignments, and continuous
                professional development tracking for engineering teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <p>© 2026 StaffSync HRM Solution. Designed following SkillWallet MERN Stack Specifications.</p>
          <div className="footer-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/employee">Employee Portal</Link>
            <Link to="/hr">HR Portal</Link>
            <Link to="/manager">Manager Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
