import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getFirestoreEmployees,
  addFirestoreEmployee,
  updateFirestoreEmployee,
  deleteFirestoreEmployee,
  getFirestoreLeaves,
  addFirestoreLeave,
  updateFirestoreLeaveStatus,
  getFirestoreAttendance,
  addFirestoreAttendance,
  updateFirestoreAttendanceCheckOut,
  getFirestoreAnnouncements,
  addFirestoreAnnouncement,
  deleteFirestoreAnnouncement,
  getFirestoreTrainings,
  addFirestoreTraining,
  updateFirestoreTraining,
  deleteFirestoreTraining
} from '../services/firebaseService';
import { isFirebaseConfigured } from '../firebase/config';

const DataContext = createContext();

const INITIAL_EMPLOYEES = [
  {
    _id: 'emp_1',
    name: 'Pravanshu Samadhiya',
    email: 'Pravanshu@gmail.com',
    department: 'Engineering',
    position: 'Full Stack Developer',
    salary: 85000,
    joinDate: '2024-01-15',
    phone: '+91 98765 43210',
    address: 'Sector 62, Noida, UP',
    status: 'Active'
  },
  {
    _id: 'emp_2',
    name: 'Sakshi Verma',
    email: 'sakshi.verma@staffsync.io',
    department: 'Human Resources',
    position: 'HR Executive',
    salary: 72000,
    joinDate: '2023-08-10',
    phone: '+91 91234 56789',
    address: 'Cyber Hub, Gurugram, Haryana',
    status: 'Active'
  },
  {
    _id: 'emp_3',
    name: 'Adnan Saif',
    email: 'adnan.saif@staffsync.io',
    department: 'Product',
    position: 'Technical Trainer & Lead',
    salary: 95000,
    joinDate: '2022-05-20',
    phone: '+91 99887 76655',
    address: 'Koramangala, Bengaluru, KA',
    status: 'Active'
  },
  {
    _id: 'emp_4',
    name: 'John Doe',
    email: 'johndoe@email.com',
    department: 'Quality Assurance',
    position: 'Senior QA Analyst',
    salary: 68000,
    joinDate: '2024-03-01',
    phone: '+91 98111 22334',
    address: 'Whitefield, Bengaluru, KA',
    status: 'Active'
  },
  {
    _id: 'emp_5',
    name: 'Priya Sharma',
    email: 'priya.sharma@staffsync.io',
    department: 'Engineering',
    position: 'UI/UX Designer',
    salary: 78000,
    joinDate: '2023-11-12',
    phone: '+91 97654 32109',
    address: 'Indiranagar, Bengaluru, KA',
    status: 'Active'
  }
];

const INITIAL_LEAVES = [
  {
    _id: 'leave_1',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    employeeEmail: 'Pravanshu@gmail.com',
    startDate: '2025-11-05',
    endDate: '2025-11-06',
    reason: 'I have to go for Office Meeting',
    status: 'Approved',
    approverRole: 'HR',
    approvedBy: 'HR Admin',
    createdAt: '2025-11-01'
  },
  {
    _id: 'leave_2',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    employeeEmail: 'Pravanshu@gmail.com',
    startDate: '2025-11-10',
    endDate: '2025-11-12',
    reason: 'Family function at hometown',
    status: 'Rejected',
    approverRole: 'HR',
    approvedBy: 'HR Admin',
    createdAt: '2025-11-02'
  },
  {
    _id: 'leave_3',
    user: 'usr_emp2',
    employeeName: 'Sakshi Verma',
    employeeEmail: 'sakshi.verma@staffsync.io',
    startDate: '2025-11-15',
    endDate: '2025-11-16',
    reason: 'Medical checkup and personal appointment',
    status: 'Pending',
    approverRole: null,
    approvedBy: null,
    createdAt: '2025-11-04'
  },
  {
    _id: 'leave_4',
    user: 'usr_emp4',
    employeeName: 'John Doe',
    employeeEmail: 'johndoe@email.com',
    startDate: '2025-11-20',
    endDate: '2025-11-22',
    reason: 'Annual family vacation',
    status: 'Pending',
    approverRole: null,
    approvedBy: null,
    createdAt: '2025-11-05'
  }
];

const INITIAL_ATTENDANCE = [
  {
    _id: 'att_1',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    date: '2025-11-04',
    checkInTime: '9:24:19 AM',
    checkOutTime: '10:07:23 AM',
    status: 'Present'
  },
  {
    _id: 'att_2',
    user: 'usr_emp1',
    employeeName: 'Pravanshu Samadhiya',
    date: '2025-11-03',
    checkInTime: '3:47:43 PM',
    checkOutTime: '3:47:54 PM',
    status: 'Present'
  },
  {
    _id: 'att_3',
    user: 'usr_emp2',
    employeeName: 'Sakshi Verma',
    date: '2025-11-04',
    checkInTime: '9:15:00 AM',
    checkOutTime: '5:30:00 PM',
    status: 'Present'
  },
  {
    _id: 'att_4',
    user: 'usr_emp3',
    employeeName: 'Adnan Saif',
    date: '2025-11-04',
    checkInTime: '9:45:12 AM',
    checkOutTime: '1:30:00 PM',
    status: 'Half Day'
  },
  {
    _id: 'att_5',
    user: 'usr_emp4',
    employeeName: 'John Doe',
    date: '2025-11-04',
    checkInTime: '--',
    checkOutTime: '--',
    status: 'Absent'
  }
];

const INITIAL_ANNOUNCEMENTS = [
  {
    _id: 'anc_1',
    title: 'Quarterly Town Hall & Product Roadmap 2026',
    message: 'Join us this Friday at 3:00 PM IST for our Q4 all-hands town hall meeting with executive leadership.',
    targetAudience: 'All',
    createdByName: 'HR Department',
    createdAt: '2025-11-01T10:00:00Z'
  },
  {
    _id: 'anc_2',
    title: 'Annual Performance Appraisal Cycle Kickoff',
    message: 'The self-evaluation portal is now open for the annual review cycle. Please submit reviews before Nov 20.',
    targetAudience: 'Employees',
    createdByName: 'HR Department',
    createdAt: '2025-10-28T09:30:00Z'
  },
  {
    _id: 'anc_3',
    title: 'Upcoming National Holiday Schedule Notice',
    message: 'Our corporate offices will remain closed next Monday in observance of the declared festival holiday.',
    targetAudience: 'All',
    createdByName: 'HR Department',
    createdAt: '2025-10-26T12:00:00Z'
  },
  {
    _id: 'anc_4',
    title: 'Managers Sync: Resource Planning',
    message: 'All department managers are requested to attend the budget and head count review session on Thursday.',
    targetAudience: 'Managers',
    createdByName: 'Executive Office',
    createdAt: '2025-10-25T14:15:00Z'
  }
];

const INITIAL_TRAININGS = [
  {
    _id: 'trn_1',
    title: 'MongoDB CRUD',
    description: 'This Training Session relates to the MongoDB CRUD Operation',
    date: '2025-11-05',
    trainer: 'Adnan Saif',
    assignedEmployeeId: 'NA',
    status: 'Scheduled',
    createdAt: '2025-10-24'
  },
  {
    _id: 'trn_2',
    title: 'React 18 Performance & Concurrent Mode',
    description: 'Hands-on workshop exploring React concurrency, transitions, and suspense patterns.',
    date: '2025-11-12',
    trainer: 'Sakshi Verma',
    assignedEmployeeId: 'Engineering Dept',
    status: 'Scheduled',
    createdAt: '2025-10-26'
  },
  {
    _id: 'trn_3',
    title: 'Cybersecurity & Compliance Training',
    description: 'Mandatory information security protocols, phishing awareness, and data compliance.',
    date: '2025-11-18',
    trainer: 'Security Lead',
    assignedEmployeeId: 'All Staff',
    status: 'In Progress',
    createdAt: '2025-10-28'
  }
];

export const DataProvider = ({ children }) => {
  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('staffsync_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('staffsync_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('staffsync_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('staffsync_announcements');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [trainings, setTrainings] = useState(() => {
    const saved = localStorage.getItem('staffsync_trainings');
    return saved ? JSON.parse(saved) : INITIAL_TRAININGS;
  });

  const [isCheckedIn, setIsCheckedIn] = useState(() => {
    return localStorage.getItem('staffsync_is_checked_in') === 'true';
  });

  // Pull remote data from Firestore if configured
  useEffect(() => {
    if (isFirebaseConfigured()) {
      const syncFromFirestore = async () => {
        try {
          const [fbEmps, fbLeaves, fbAtt, fbAnc, fbTrn] = await Promise.all([
            getFirestoreEmployees(),
            getFirestoreLeaves(),
            getFirestoreAttendance(),
            getFirestoreAnnouncements(),
            getFirestoreTrainings()
          ]);

          if (fbEmps && fbEmps.length > 0) setEmployees(fbEmps);
          if (fbLeaves && fbLeaves.length > 0) setLeaves(fbLeaves);
          if (fbAtt && fbAtt.length > 0) setAttendance(fbAtt);
          if (fbAnc && fbAnc.length > 0) setAnnouncements(fbAnc);
          if (fbTrn && fbTrn.length > 0) setTrainings(fbTrn);
        } catch (err) {
          console.warn('Firestore initial synchronization notice:', err);
        }
      };
      syncFromFirestore();
    }
  }, []);

  // Persist locally
  useEffect(() => {
    localStorage.setItem('staffsync_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('staffsync_leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('staffsync_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('staffsync_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('staffsync_trainings', JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem('staffsync_is_checked_in', String(isCheckedIn));
  }, [isCheckedIn]);

  // Employee CRUD operations
  const addEmployee = async (empData) => {
    const payload = {
      ...empData,
      salary: Number(empData.salary) || 0,
      status: empData.status || 'Active'
    };

    if (isFirebaseConfigured()) {
      try {
        const created = await addFirestoreEmployee(payload);
        setEmployees((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        console.warn('Firestore fallback on addEmployee');
      }
    }

    const newEmp = {
      _id: 'emp_' + Date.now(),
      ...payload
    };
    setEmployees((prev) => [newEmp, ...prev]);
    return newEmp;
  };

  const updateEmployee = async (id, updatedFields) => {
    const payload = {
      ...updatedFields,
      salary: Number(updatedFields.salary || 0)
    };

    if (isFirebaseConfigured()) {
      try {
        await updateFirestoreEmployee(id, payload);
      } catch (err) {
        console.warn('Firestore fallback on updateEmployee');
      }
    }

    setEmployees((prev) =>
      prev.map((emp) => (emp._id === id ? { ...emp, ...payload } : emp))
    );
  };

  const deleteEmployee = async (id) => {
    if (isFirebaseConfigured()) {
      try {
        await deleteFirestoreEmployee(id);
      } catch (err) {
        console.warn('Firestore fallback on deleteEmployee');
      }
    }
    setEmployees((prev) => prev.filter((emp) => emp._id !== id));
  };

  const toggleEmployeeStatus = async (id) => {
    const target = employees.find((e) => e._id === id);
    const newStatus = target?.status === 'Active' ? 'Inactive' : 'Active';

    if (isFirebaseConfigured()) {
      try {
        await updateFirestoreEmployee(id, { status: newStatus });
      } catch (err) {
        console.warn('Firestore fallback on toggleEmployeeStatus');
      }
    }

    setEmployees((prev) =>
      prev.map((emp) => (emp._id === id ? { ...emp, status: newStatus } : emp))
    );
  };

  // Leave operations
  const applyLeave = async (leaveData) => {
    const payload = {
      ...leaveData,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (isFirebaseConfigured()) {
      try {
        const created = await addFirestoreLeave(payload);
        setLeaves((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        console.warn('Firestore fallback on applyLeave');
      }
    }

    const newLeave = {
      _id: 'leave_' + Date.now(),
      ...payload
    };
    setLeaves((prev) => [newLeave, ...prev]);
    return newLeave;
  };

  const updateLeaveStatus = async (id, status, approverRole = 'HR', approvedBy = 'StaffSync Admin') => {
    if (isFirebaseConfigured()) {
      try {
        await updateFirestoreLeaveStatus(id, status, approverRole, approvedBy);
      } catch (err) {
        console.warn('Firestore fallback on updateLeaveStatus');
      }
    }

    setLeaves((prev) =>
      prev.map((l) =>
        l._id === id ? { ...l, status, approverRole, approvedBy } : l
      )
    );
  };

  // Attendance operations
  const handleCheckIn = async (employeeName = 'Pravanshu Samadhiya') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    const dateStr = now.toISOString().split('T')[0];

    const record = {
      user: 'usr_current',
      employeeName,
      date: dateStr,
      checkInTime: timeStr,
      checkOutTime: '--',
      status: 'Present'
    };

    if (isFirebaseConfigured()) {
      try {
        const created = await addFirestoreAttendance(record);
        setAttendance((prev) => [created, ...prev]);
        setIsCheckedIn(true);
        return;
      } catch (err) {
        console.warn('Firestore fallback on handleCheckIn');
      }
    }

    const newRecord = {
      _id: 'att_' + Date.now(),
      ...record
    };

    setAttendance((prev) => [newRecord, ...prev]);
    setIsCheckedIn(true);
  };

  const handleCheckOut = async () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const activeRec = attendance[0];
    if (activeRec && isFirebaseConfigured()) {
      try {
        await updateFirestoreAttendanceCheckOut(activeRec._id, timeStr);
      } catch (err) {
        console.warn('Firestore fallback on handleCheckOut');
      }
    }

    setAttendance((prev) => {
      const copy = [...prev];
      if (copy.length > 0) {
        copy[0] = { ...copy[0], checkOutTime: timeStr };
      }
      return copy;
    });
    setIsCheckedIn(false);
  };

  // Announcements operations
  const addAnnouncement = async (ancData) => {
    const payload = {
      ...ancData,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured()) {
      try {
        const created = await addFirestoreAnnouncement(payload);
        setAnnouncements((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        console.warn('Firestore fallback on addAnnouncement');
      }
    }

    const newAnc = {
      _id: 'anc_' + Date.now(),
      ...payload
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    return newAnc;
  };

  const deleteAnnouncement = async (id) => {
    if (isFirebaseConfigured()) {
      try {
        await deleteFirestoreAnnouncement(id);
      } catch (err) {
        console.warn('Firestore fallback on deleteAnnouncement');
      }
    }
    setAnnouncements((prev) => prev.filter((a) => a._id !== id));
  };

  // Training operations
  const addTraining = async (trnData) => {
    const payload = {
      ...trnData,
      status: 'Scheduled',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (isFirebaseConfigured()) {
      try {
        const created = await addFirestoreTraining(payload);
        setTrainings((prev) => [created, ...prev]);
        return created;
      } catch (err) {
        console.warn('Firestore fallback on addTraining');
      }
    }

    const newTrn = {
      _id: 'trn_' + Date.now(),
      ...payload
    };
    setTrainings((prev) => [newTrn, ...prev]);
    return newTrn;
  };

  const updateTraining = async (id, updatedFields) => {
    if (isFirebaseConfigured()) {
      try {
        await updateFirestoreTraining(id, updatedFields);
      } catch (err) {
        console.warn('Firestore fallback on updateTraining');
      }
    }

    setTrainings((prev) =>
      prev.map((t) => (t._id === id ? { ...t, ...updatedFields } : t))
    );
  };

  const deleteTraining = async (id) => {
    if (isFirebaseConfigured()) {
      try {
        await deleteFirestoreTraining(id);
      } catch (err) {
        console.warn('Firestore fallback on deleteTraining');
      }
    }
    setTrainings((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        employees,
        leaves,
        attendance,
        announcements,
        trainings,
        isCheckedIn,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        toggleEmployeeStatus,
        applyLeave,
        updateLeaveStatus,
        handleCheckIn,
        handleCheckOut,
        addAnnouncement,
        deleteAnnouncement,
        addTraining,
        updateTraining,
        deleteTraining
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
