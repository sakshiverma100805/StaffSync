import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';

// Friendly error parser for Firebase Auth error codes
export const formatFirebaseAuthError = (error) => {
  const code = error?.code || '';
  switch (code) {
    case 'auth/configuration-not-found':
      return 'Firebase Authentication is enabled now. Please retry in 10-15 seconds for the Google servers to finish propagating.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials.';
    case 'auth/network-request-failed':
      return 'Network connection issue. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to multiple failed attempts. Please try again later.';
    default:
      return error?.message ? error.message.replace('Firebase: ', '').replace(/\(auth\/[^)]+\)\.?/, '').trim() : 'Authentication failed';
  }
};

// -------------------------------------------------------------
// Authentication Services
// -------------------------------------------------------------

export const firebaseRegisterUser = async (email, password, profileData) => {
  if (!isFirebaseConfigured() || !auth || !db) {
    throw new Error('Firebase is not yet configured.');
  }

  try {
    // 1. Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // 2. Create User Profile document in Firestore "users" collection
    const userDocRef = doc(db, 'users', uid);
    const userData = {
      uid,
      name: profileData.name,
      email: email.toLowerCase(),
      role: profileData.role || 'Employee',
      department: profileData.department || 'Software Development',
      position: profileData.position || 'Associate',
      phone: profileData.phone || '',
      address: profileData.address || '',
      createdAt: serverTimestamp()
    };

    try {
      await setDoc(userDocRef, userData);
    } catch (fsErr) {
      console.warn('Profile write notice in Firestore:', fsErr.message);
    }

    return { ...userData, _id: uid };
  } catch (err) {
    throw new Error(formatFirebaseAuthError(err));
  }
};

export const firebaseLoginUser = async (email, password) => {
  if (!isFirebaseConfigured() || !auth || !db) {
    throw new Error('Firebase is not yet configured.');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    // Fetch role and details from Firestore
    try {
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        return { ...userSnap.data(), _id: uid };
      }
    } catch (fsErr) {
      console.warn('Profile read notice in Firestore:', fsErr.message);
    }

    // Default fallback if doc doesn't exist yet
    return {
      _id: uid,
      uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
      role: 'Employee'
    };
  } catch (err) {
    throw new Error(formatFirebaseAuthError(err));
  }
};

export const firebaseLogoutUser = async () => {
  if (isFirebaseConfigured() && auth) {
    await signOut(auth);
  }
};

// -------------------------------------------------------------
// Firestore Collection Services: Employees
// -------------------------------------------------------------

export const getFirestoreEmployees = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'employees');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ _id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Error fetching employees from Firestore:', err.message);
    return null;
  }
};

export const addFirestoreEmployee = async (employeeData) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'employees');
    const docRef = await addDoc(colRef, {
      ...employeeData,
      createdAt: serverTimestamp()
    });
    return { _id: docRef.id, ...employeeData };
  } catch (err) {
    console.warn('Error adding employee to Firestore:', err.message);
    throw err;
  }
};

export const updateFirestoreEmployee = async (id, updatedFields) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'employees', id);
    await updateDoc(docRef, { ...updatedFields, updatedAt: serverTimestamp() });
    return true;
  } catch (err) {
    console.warn('Error updating employee in Firestore:', err.message);
    throw err;
  }
};

export const deleteFirestoreEmployee = async (id) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'employees', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Error deleting employee from Firestore:', err.message);
    throw err;
  }
};

// -------------------------------------------------------------
// Firestore Collection Services: Leaves
// -------------------------------------------------------------

export const getFirestoreLeaves = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'leaves');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ _id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Error fetching leaves from Firestore:', err.message);
    return null;
  }
};

export const addFirestoreLeave = async (leaveData) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'leaves');
    const docRef = await addDoc(colRef, {
      ...leaveData,
      status: 'Pending',
      createdAt: serverTimestamp()
    });
    return { _id: docRef.id, ...leaveData, status: 'Pending' };
  } catch (err) {
    console.warn('Error adding leave to Firestore:', err.message);
    throw err;
  }
};

export const updateFirestoreLeaveStatus = async (id, status, approverRole, approvedBy) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'leaves', id);
    await updateDoc(docRef, {
      status,
      approverRole,
      approvedBy,
      reviewedAt: serverTimestamp()
    });
    return true;
  } catch (err) {
    console.warn('Error updating leave status in Firestore:', err.message);
    throw err;
  }
};

// -------------------------------------------------------------
// Firestore Collection Services: Attendance
// -------------------------------------------------------------

export const getFirestoreAttendance = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'attendance');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ _id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Error fetching attendance from Firestore:', err.message);
    return null;
  }
};

export const addFirestoreAttendance = async (attendanceRecord) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'attendance');
    const docRef = await addDoc(colRef, {
      ...attendanceRecord,
      createdAt: serverTimestamp()
    });
    return { _id: docRef.id, ...attendanceRecord };
  } catch (err) {
    console.warn('Error recording attendance in Firestore:', err.message);
    throw err;
  }
};

export const updateFirestoreAttendanceCheckOut = async (id, checkOutTime) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'attendance', id);
    await updateDoc(docRef, { checkOutTime, updatedAt: serverTimestamp() });
    return true;
  } catch (err) {
    console.warn('Error updating checkout in Firestore:', err.message);
    throw err;
  }
};

// -------------------------------------------------------------
// Firestore Collection Services: Announcements
// -------------------------------------------------------------

export const getFirestoreAnnouncements = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'announcements');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ _id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Error fetching announcements from Firestore:', err.message);
    return null;
  }
};

export const addFirestoreAnnouncement = async (announcementData) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'announcements');
    const docRef = await addDoc(colRef, {
      ...announcementData,
      createdAt: serverTimestamp()
    });
    return { _id: docRef.id, ...announcementData };
  } catch (err) {
    console.warn('Error creating announcement in Firestore:', err.message);
    throw err;
  }
};

export const deleteFirestoreAnnouncement = async (id) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'announcements', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Error deleting announcement in Firestore:', err.message);
    throw err;
  }
};

// -------------------------------------------------------------
// Firestore Collection Services: Trainings
// -------------------------------------------------------------

export const getFirestoreTrainings = async () => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'trainings');
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((d) => ({ _id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('Error fetching trainings from Firestore:', err.message);
    return null;
  }
};

export const addFirestoreTraining = async (trainingData) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const colRef = collection(db, 'trainings');
    const docRef = await addDoc(colRef, {
      ...trainingData,
      status: trainingData.status || 'Scheduled',
      createdAt: serverTimestamp()
    });
    return { _id: docRef.id, ...trainingData };
  } catch (err) {
    console.warn('Error adding training in Firestore:', err.message);
    throw err;
  }
};

export const updateFirestoreTraining = async (id, updatedFields) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'trainings', id);
    await updateDoc(docRef, { ...updatedFields, updatedAt: serverTimestamp() });
    return true;
  } catch (err) {
    console.warn('Error updating training in Firestore:', err.message);
    throw err;
  }
};

export const deleteFirestoreTraining = async (id) => {
  if (!isFirebaseConfigured() || !db) return null;
  try {
    const docRef = doc(db, 'trainings', id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Error deleting training in Firestore:', err.message);
    throw err;
  }
};
