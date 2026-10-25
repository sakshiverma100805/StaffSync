import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import LeaveApplications from '../components/hr/LeaveApplications';
import EmployeeCRUD from '../components/hr/EmployeeCRUD';
import AnnouncementsManager from '../components/hr/AnnouncementsManager';
import AttendanceSummary from '../components/hr/AttendanceSummary';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  Users,
  Bell,
  Calendar,
  Clock,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const HrDashboard = () => {
  const { user } = useAuth();
  const { employees, leaves, attendance, announcements } = useData();

  // Tabs: Leave Applications, Employee Management, Announcements, Attendance
  const [activeTab, setActiveTab] = useState('Leave Applications');

  // Overview metrics
  const activeEmployeesCount = employees.filter((e) => e.status !== 'Inactive').length;
  const pendingLeavesCount = leaves.filter((l) => l.status === 'Pending').length;
  const presentTodayCount = attendance.filter((a) => a.status === 'Present').length;

  return (
    <div className="portal-layout">
      {/* Top Navbar */}
      <Navbar portalTitle="HR Portal" />

      {/* Main Container */}
      <main className="portal-main-container">
        {/* Header Block matching page 56 */}
        <div className="portal-header-row">
          <div className="portal-title-block">
            <h1 className="portal-title">HR Dashboard</h1>
            <p className="portal-welcome-text">
              Welcome, <strong className="text-white">{user?.name || 'HR Admin'}</strong> — Centralized Workforce Management
            </p>
          </div>

          {/* Navigation Tabs matching page 56 */}
          <div className="portal-tabs-nav">
            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Leave Applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('Leave Applications')}
            >
              <FileCheck2 size={15} />
              <span>Leave Applications</span>
              {pendingLeavesCount > 0 && (
                <span className="tab-bubble-count">{pendingLeavesCount}</span>
              )}
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Employee Management' ? 'active' : ''}`}
              onClick={() => setActiveTab('Employee Management')}
            >
              <Users size={15} />
              <span>Employee Management</span>
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Announcements' ? 'active' : ''}`}
              onClick={() => setActiveTab('Announcements')}
            >
              <Bell size={15} />
              <span>Announcements</span>
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('Attendance')}
            >
              <Calendar size={15} />
              <span>Attendance</span>
            </button>
          </div>
        </div>

        {/* High-level Quick Stats Strip */}
        <div className="metrics-summary-grid mb-6">
          <div className="metric-stat-card">
            <div className="metric-icon-box text-blue">
              <Users size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num">{activeEmployeesCount}</span>
              <span className="metric-label">Active Employees</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-box text-amber">
              <Clock size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num text-amber">{pendingLeavesCount}</span>
              <span className="metric-label">Pending Leaves</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-box text-green">
              <CheckCircle2 size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num text-green">{presentTodayCount}</span>
              <span className="metric-label">Present Records</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-box text-purple">
              <Bell size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num text-purple">{announcements.length}</span>
              <span className="metric-label">Broadcasts</span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Content matching page 56-57 */}
        {activeTab === 'Leave Applications' && <LeaveApplications />}
        {activeTab === 'Employee Management' && <EmployeeCRUD />}
        {activeTab === 'Announcements' && <AnnouncementsManager />}
        {activeTab === 'Attendance' && <AttendanceSummary />}
      </main>
    </div>
  );
};

export default HrDashboard;
