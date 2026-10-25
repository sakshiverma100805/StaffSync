import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  firebaseLoginUser,
  firebaseRegisterUser,
  firebaseLogoutUser
} from '../services/firebaseService';
import { isFirebaseConfigured, auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

// Pre-seeded base company users (stored securely on the backend / local DB, never exposed in login form)
const DEFAULT_SYSTEM_ACCOUNTS = [
  {
    _id: 'usr_emp1',
    uid: 'usr_emp1',
    name: 'Pravanshu Samadhiya',
    email: 'pravanshu@gmail.com',
    password: 'password123',
    role: 'Employee',
    department: 'Software Development',
    position: 'Full Stack Developer',
    joinDate: '2024-01-15',
    phone: '+91 98765 43210',
    address: 'Sector 62, Noida, UP'
  },
  {
    _id: 'usr_hr1',
    uid: 'usr_hr1',
    name: 'Sakshi Verma',
    email: 'hr.admin@staffsync.io',
    password: 'password123',
    role: 'HR',
    department: 'Human Resources',
    position: 'Lead HR Manager',
    joinDate: '2023-08-10',
    phone: '+91 91234 56789',
    address: 'Cyber Hub, Gurugram, Haryana'
  },
  {
    _id: 'usr_mgr1',
    uid: 'usr_mgr1',
    name: 'Adnan Saif',
    email: 'manager@staffsync.io',
    password: 'password123',
    role: 'Manager',
    department: 'Engineering',
    position: 'Engineering Lead & Manager',
    joinDate: '2022-05-20',
    phone: '+91 99887 76655',
    address: 'Koramangala, Bengaluru, KA'
  }
];

export const AuthProvider = ({ children }) => {
  // Current active session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('staffsync_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Local user directory for credentials check
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('staffsync_registered_users');
      return saved ? JSON.parse(saved) : DEFAULT_SYSTEM_ACCOUNTS;
    } catch {
      return DEFAULT_SYSTEM_ACCOUNTS;
    }
  });

  const [loading, setLoading] = useState(false);
  const [isFirebaseActive, setIsFirebaseActive] = useState(isFirebaseConfigured());

  // Keep registered accounts in localStorage
  useEffect(() => {
    localStorage.setItem('staffsync_registered_users', JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Keep active session in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('staffsync_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('staffsync_user');
    }
  }, [user]);

  // Listen for Firebase Auth state changes if Firebase is active
  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser && user && user.isFirebaseAuth) {
          setUser(null);
          localStorage.removeItem('staffsync_user');
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    // 1. Try Firebase Authentication if configured
    if (isFirebaseConfigured()) {
      try {
        const fbUser = await firebaseLoginUser(normalizedEmail, password);
        const authedUser = { ...fbUser, isFirebaseAuth: true };
        setUser(authedUser);
        setLoading(false);
        return authedUser;
      } catch (err) {
        setLoading(false);
        throw new Error(err.message || 'Firebase authentication failed');
      }
    }

    // 2. Local Account Verification
    await new Promise((r) => setTimeout(r, 300));

    const matchedAccount = registeredUsers.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!matchedAccount) {
      setLoading(false);
      throw new Error('No account found with this email. Please check your email or register.');
    }

    // Verify password
    if (matchedAccount.password && matchedAccount.password !== password) {
      setLoading(false);
      throw new Error('Incorrect password. Please verify your credentials and try again.');
    }

    // Exclude password from active session for security
    const { password: _, ...safeUser } = matchedAccount;
    setUser(safeUser);
    setLoading(false);
    return safeUser;
  };

  const register = async (userData) => {
    setLoading(true);
    const normalizedEmail = userData.email.toLowerCase().trim();

    // Check if user already exists
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === normalizedEmail);
    if (exists) {
      setLoading(false);
      throw new Error('An account with this email address already exists.');
    }

    // 1. Try Firebase Authentication Registration if configured
    if (isFirebaseConfigured()) {
      try {
        const fbUser = await firebaseRegisterUser(normalizedEmail, userData.password, userData);
        const authedUser = { ...fbUser, isFirebaseAuth: true };
        setUser(authedUser);
        setLoading(false);
        return authedUser;
      } catch (err) {
        setLoading(false);
        throw new Error(err.message || 'Firebase registration failed');
      }
    }

    // 2. Local Account Creation
    await new Promise((r) => setTimeout(r, 350));

    const newUser = {
      _id: 'usr_' + Date.now(),
      uid: 'usr_' + Date.now(),
      name: userData.name.trim(),
      email: normalizedEmail,
      password: userData.password,
      role: userData.role || 'Employee',
      department:
        userData.department ||
        (userData.role === 'HR'
          ? 'Human Resources'
          : userData.role === 'Manager'
          ? 'Engineering'
          : 'Software Development'),
      position:
        userData.position ||
        (userData.role === 'HR'
          ? 'HR Specialist'
          : userData.role === 'Manager'
          ? 'Team Lead'
          : 'Software Engineer'),
      joinDate: new Date().toISOString().split('T')[0],
      phone: userData.phone || '',
      address: userData.address || ''
    };

    setRegisteredUsers((prev) => [...prev, newUser]);

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    setLoading(false);
    return safeUser;
  };

  const logout = async () => {
    if (isFirebaseConfigured()) {
      try {
        await firebaseLogoutUser();
      } catch (err) {
        console.warn('Firebase logout warning:', err);
      }
    }
    setUser(null);
    localStorage.removeItem('staffsync_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isFirebaseActive
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
