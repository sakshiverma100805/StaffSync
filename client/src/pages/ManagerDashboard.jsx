import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import ManagerLeaveApplications from '../components/manager/LeaveApplications';
import TrainingManagement from '../components/manager/TrainingManagement';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { FileCheck, BookOpen, Clock, Users, Sparkles, CheckCircle } from 'lucide-react';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const { leaves, trainings } = useData();

  const [activeTab, setActiveTab] = useState('Leave Applications');

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;

  return (
    <div className="portal-layout">
      {/* Top Navbar */}
      <Navbar portalTitle="Manager Dashboard" />

      {/* Main Container */}
      <main className="portal-main-container">
        {/* Header Block matching page 57 */}
        <div className="portal-header-row">
          <div className="portal-title-block">
            <h1 className="portal-title">Welcome Back, Manager</h1>
            <p className="portal-welcome-text">
              Team Oversight, Leave Approvals & Technical Skill Development
            </p>
          </div>

          {/* Navigation Tabs matching page 57 */}
          <div className="portal-tabs-nav">
            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Leave Applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('Leave Applications')}
            >
              <FileCheck size={15} />
              <span>Leave Applications</span>
              {pendingCount > 0 && <span className="tab-bubble-count">{pendingCount}</span>}
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Training & Development' ? 'active' : ''}`}
              onClick={() => setActiveTab('Training & Development')}
            >
              <BookOpen size={15} />
              <span>Training & Development</span>
            </button>
          </div>
        </div>

        {/* Manager Metric Highlights */}
        <div className="metrics-summary-grid mb-6">
          <div className="metric-stat-card">
            <div className="metric-icon-box text-blue">
              <FileCheck size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num">{leaves.length}</span>
              <span className="metric-label">Total Applications</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-box text-amber">
              <Clock size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num text-amber">{pendingCount}</span>
              <span className="metric-label">Needs Review</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-box text-cyan">
              <BookOpen size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num text-cyan">{trainings.length}</span>
              <span className="metric-label">Scheduled Trainings</span>
            </div>
          </div>

          <div className="metric-stat-card">
            <div className="metric-icon-box text-green">
              <Sparkles size={22} />
            </div>
            <div className="metric-text-box">
              <span className="metric-num text-green">100%</span>
              <span className="metric-label">Team Engagement</span>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views matching pages 57-58 */}
        {activeTab === 'Leave Applications' && <ManagerLeaveApplications />}
        {activeTab === 'Training & Development' && <TrainingManagement />}
      </main>
    </div>
  );
};

export default ManagerDashboard;
