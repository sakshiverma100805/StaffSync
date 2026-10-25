# StaffSync - Modern Human Resource Management Solution

**Developer:** Sakshi Verma  
**Track:** Full Stack Development (MERN Stack & Firebase)  
**Project Name:** StaffSync - Modern Human Resource Management Solution  
**Live Production URL:** [https://staffsync-33c11.web.app](https://staffsync-33c11.web.app)  
**Alternative Domain:** [https://staffsync-33c11.firebaseapp.com](https://staffsync-33c11.firebaseapp.com)

---

## 🚀 Live Demo & Overview

**StaffSync** is a comprehensive web-based Human Resource Management (HRM) application designed to automate, streamline, and centralize organizational HR operations. The platform implements distinct role-based access control (RBAC) across three primary user roles:

1. **HR Personnel:**
   - Manage complete employee records (Add, View, Edit, and Deactivate/Delete).
   - Review and process employee leave applications (Approve / Reject).
   - Track organization-wide attendance logs with real-time status indicators.
   - Publish company announcements with audience targeting (`All`, `Employees`, `Managers`).

2. **Managers:**
   - Review, approve, and reject team leave applications with real-time updates.
   - Create, assign, edit, and track employee training and technical development programs (e.g. *MongoDB CRUD*).

3. **Employees:**
   - Mark daily check-in and check-out attendance with live digital time logging.
   - Submit leave applications with date range selection and track approval status (`Pending`, `Approved`, `Rejected`).
   - Maintain personal profiles and contact information.
   - Access company broadcasts, announcements, and assigned skill development programs.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Vite, React Router DOM (v6), Modern CSS3 Design System, Lucide React Icons
- **Backend Architecture:** Node.js, Express.js REST API
- **Database & Cloud:** Cloud Firestore, MongoDB Schemas, Mongoose ODM
- **Authentication & Security:** Firebase Authentication, JSON Web Tokens (JWT), Role-Based Access Control (RBAC), Granular Firestore Security Rules
- **Deployment & Hosting:** Firebase Hosting with Single-Page Application (SPA) URL rewrites

---

## 📂 Project Structure

```text
StaffSync/
├── client/                                  # React.js + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                        # Login.jsx, Register.jsx
│   │   │   ├── common/                      # Navbar.jsx
│   │   │   ├── employee/                    # Announcements.jsx, Attendance.jsx, LeaveApply.jsx, LeaveList.jsx
│   │   │   ├── hr/                          # EmployeeCRUD.jsx, LeaveApplications.jsx, AnnouncementsManager.jsx, AttendanceSummary.jsx
│   │   │   └── manager/                     # LeaveApplications.jsx, TrainingManagement.jsx
│   │   ├── context/                         # AuthContext.jsx, DataContext.jsx
│   │   ├── firebase/                        # config.js
│   │   ├── pages/                           # Home.jsx, EmployeeDashboard.jsx, HrDashboard.jsx, ManagerDashboard.jsx
│   │   ├── routes/                          # ProtectedRoute.jsx (Strict 403 RBAC Guard)
│   │   ├── services/                        # firebaseService.js
│   │   ├── App.css                          # Modern Dark-Mode Design System
│   │   ├── App.jsx                          # Route definitions
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/                                  # Node.js + Express REST API
│   ├── config/db.js                         # Database connection
│   ├── controllers/                         # auth, employee, leave, attendance, announcement, training
│   ├── middleware/                          # authMiddleware.js (JWT & RBAC verification)
│   ├── models/                              # User, Employee, Leave, Attendance, Announcement, Training
│   ├── routes/                              # API routes
│   ├── server.js                            # Express server entry point
│   └── package.json
├── firestore.rules                          # Cloud Firestore RBAC Security Rules
├── firebase.json                            # Firebase Hosting & Firestore configuration
├── .firebaserc                              # Firebase project alias (staffsync-33c11)
├── .gitignore
└── README.md
```

---

## ⚙️ Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/<your-username>/StaffSync.git
cd StaffSync
```

### 2. Frontend Setup (React Client)
```bash
cd client
npm install
npm run dev
```
The React frontend will be live on: `http://localhost:5173`

### 3. Backend Setup (Express Server)
```bash
cd ../server
npm install
npm run dev
```
The Express API will run on: `http://localhost:5000`

---

## 🔒 Security & Role-Based Access Control

- **403 Security Barrier:** Any unauthorized attempt by an employee to access `/hr` or `/manager` routes is strictly blocked by `ProtectedRoute.jsx` with an explicit Access Denied screen.
- **Firestore Security Rules:** Cloud-enforced rules ensure employees cannot access other staff's private records or escalate their permissions.

---

## 📜 Submission Details

- **Author:** Sakshi Verma
- **Track:** Full Stack Development (MERN Stack)
- **Live Demo:** [https://staffsync-33c11.web.app](https://staffsync-33c11.web.app)
- **Project Evaluation:** Meets all specifications from the SkillWallet curriculum and architecture requirements.
