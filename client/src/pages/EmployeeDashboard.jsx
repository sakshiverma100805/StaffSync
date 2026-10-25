import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Announcements from '../components/employee/Announcements';
import Attendance from '../components/employee/Attendance';
import LeaveApply from '../components/employee/LeaveApply';
import LeaveList from '../components/employee/LeaveList';
import { useAuth } from '../context/AuthContext';
import {
  Bell,
  Calendar,
  Clock,
  User,
  Mail,
  Briefcase,
  Phone,
  MapPin,
  CalendarDays,
  Shield,
  Edit3,
  CheckCircle2
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Announcements');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Pravanshu Samadhiya',
    email: user?.email || 'Pravanshu@gmail.com',
    role: user?.role || 'Employee',
    department: user?.department || 'Software Development',
    position: user?.position || 'Full Stack Developer',
    joinDate: user?.joinDate || '2024-01-15',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Sector 62, Noida, UP'
  });
  const [profileSuccess, setProfileSuccess] = useState('');

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setProfileSuccess('Profile information updated successfully!');
    setTimeout(() => setProfileSuccess(''), 4000);
  };

  return (
    <div className="portal-layout">
      {/* Top Navbar */}
      <Navbar portalTitle="Employee Portal" />

      {/* Main Content Area */}
      <main className="portal-main-container">
        {/* Portal Header & Navigation Tabs matching page 53 */}
        <div className="portal-header-row">
          <div className="portal-title-block">
            <h1 className="portal-title">Employee Portal</h1>
            <p className="portal-welcome-text">
              Welcome back, <strong className="text-white">{user?.name || 'Pravanshu Samadhiya'}</strong>
            </p>
          </div>

          {/* Navigation Tabs matching page 53 */}
          <div className="portal-tabs-nav">
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
              className={`portal-tab-btn ${activeTab === 'Leaves' ? 'active' : ''}`}
              onClick={() => setActiveTab('Leaves')}
            >
              <Calendar size={15} />
              <span>Leaves</span>
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Attendance' ? 'active' : ''}`}
              onClick={() => setActiveTab('Attendance')}
            >
              <Clock size={15} />
              <span>Attendance</span>
            </button>

            <button
              type="button"
              className={`portal-tab-btn ${activeTab === 'Profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('Profile')}
            >
              <User size={15} />
              <span>Profile</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Announcements & Assigned Trainings (page 53) */}
        {activeTab === 'Announcements' && <Announcements />}

        {/* Tab 2: Leaves (Apply + My Leaves List) (page 54) */}
        {activeTab === 'Leaves' && (
          <div className="employee-leaves-tab">
            <LeaveApply />
            <LeaveList />
          </div>
        )}

        {/* Tab 3: Attendance (page 55) */}
        {activeTab === 'Attendance' && <Attendance />}

        {/* Tab 4: Profile (page 55) */}
        {activeTab === 'Profile' && (
          <div className="dashboard-section-card profile-card-wrapper">
            <div className="card-heading-row">
              <div className="heading-with-icon">
                <User size={20} className="text-blue" />
                <h3>My Profile</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="btn-profile-toggle"
              >
                <Edit3 size={14} />
                <span>{isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            {profileSuccess && (
              <div className="auth-alert success mb-4">
                <CheckCircle2 size={16} />
                <span>{profileSuccess}</span>
              </div>
            )}

            {!isEditingProfile ? (
              /* View Mode matching page 55 */
              <div className="profile-details-grid">
                <div className="profile-hero-badge">
                  <div className="profile-avatar-large">
                    {profileData.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="profile-name-lg">{profileData.name}</h2>
                    <span className="profile-badge-pill">{profileData.position}</span>
                  </div>
                </div>

                <div className="profile-specs-grid">
                  <div className="profile-field-box">
                    <span className="field-label">
                      <Mail size={13} className="text-muted" /> Email
                    </span>
                    <span className="field-value text-blue">{profileData.email}</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-label">
                      <Shield size={13} className="text-muted" /> Role
                    </span>
                    <span className="field-value font-semibold">{profileData.role}</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-label">
                      <Briefcase size={13} className="text-muted" /> Department
                    </span>
                    <span className="field-value">{profileData.department}</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-label">
                      <CalendarDays size={13} className="text-muted" /> Join Date
                    </span>
                    <span className="field-value">{profileData.joinDate}</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-label">
                      <Phone size={13} className="text-muted" /> Phone
                    </span>
                    <span className="field-value">{profileData.phone}</span>
                  </div>

                  <div className="profile-field-box">
                    <span className="field-label">
                      <MapPin size={13} className="text-muted" /> Address
                    </span>
                    <span className="field-value">{profileData.address}</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Edit Mode */
              <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                <div className="form-grid-two">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      value={profileData.position}
                      onChange={(e) => setProfileData({ ...profileData, position: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Department</label>
                    <input
                      type="text"
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label>Office / Residential Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn-blue-submit">
                    Save Profile Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="btn-cancel-edit"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default EmployeeDashboard;
