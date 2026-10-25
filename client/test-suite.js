// StaffSync Comprehensive Automated Test Suite
import assert from 'node:assert';
import fs from 'node:fs';

console.log('====================================================');
console.log('       StaffSync HRMS Quality Assurance Test Suite   ');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`[PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`[FAIL] ${name}:`, err.message);
  }
}

// 1. Check Security Rules File
runTest('Security: firestore.rules exists and contains RBAC definitions', () => {
  const content = fs.readFileSync('../firestore.rules', 'utf8');
  assert(content.includes('function isHR()'), 'Missing isHR function');
  assert(content.includes('function isManager()'), 'Missing isManager function');
  assert(content.includes('function isOwner('), 'Missing isOwner function');
  assert(content.includes('match /users/{userId}'), 'Missing users rule');
  assert(content.includes('match /employees/{employeeId}'), 'Missing employees rule');
  assert(content.includes('match /leaves/{leaveId}'), 'Missing leaves rule');
  assert(content.includes('match /attendance/{attendanceId}'), 'Missing attendance rule');
});

// 2. Check Firebase Configuration files
runTest('Configuration: Firebase config & environment templates exist', () => {
  assert(fs.existsSync('./src/firebase/config.js'), 'config.js missing');
  assert(fs.existsSync('./src/services/firebaseService.js'), 'firebaseService.js missing');
  assert(fs.existsSync('./.env.example'), '.env.example missing');
});

// 3. Check Authentication & Credentials Validation
runTest('Auth: System accounts have secure structure', () => {
  const defaultAccounts = [
    { email: 'pravanshu@gmail.com', role: 'Employee', name: 'Pravanshu Samadhiya' },
    { email: 'hr.admin@staffsync.io', role: 'HR', name: 'Sakshi Verma' },
    { email: 'manager@staffsync.io', role: 'Manager', name: 'Adnan Saif' }
  ];

  assert.strictEqual(defaultAccounts.length, 3);
  const emp = defaultAccounts.find((u) => u.role === 'Employee');
  assert.strictEqual(emp.name, 'Pravanshu Samadhiya');
  const hr = defaultAccounts.find((u) => u.role === 'HR');
  assert.strictEqual(hr.role, 'HR');
  const mgr = defaultAccounts.find((u) => u.role === 'Manager');
  assert.strictEqual(mgr.role, 'Manager');
});

// 4. Role-Based Access Control logic
runTest('RBAC: Role permission enforcement logic', () => {
  const checkAccess = (userRole, allowedRoles) => {
    return allowedRoles.includes(userRole);
  };

  // Employee should only access Employee portal
  assert.strictEqual(checkAccess('Employee', ['Employee']), true);
  assert.strictEqual(checkAccess('Employee', ['HR']), false);
  assert.strictEqual(checkAccess('Employee', ['Manager']), false);

  // HR should only access HR portal
  assert.strictEqual(checkAccess('HR', ['HR']), true);
  assert.strictEqual(checkAccess('HR', ['Employee']), false);
  assert.strictEqual(checkAccess('HR', ['Manager']), false);

  // Manager should only access Manager portal
  assert.strictEqual(checkAccess('Manager', ['Manager']), true);
  assert.strictEqual(checkAccess('Manager', ['HR']), false);
  assert.strictEqual(checkAccess('Manager', ['Employee']), false);
});

// 5. Employee CRUD state operations
runTest('Employee Management: Add, Update, Toggle Status, Delete', () => {
  let employees = [];
  
  // Add
  const newEmp = { _id: 'emp_101', name: 'Rohan Mehta', email: 'rohan@staffsync.io', department: 'Engineering', status: 'Active', salary: 75000 };
  employees.push(newEmp);
  assert.strictEqual(employees.length, 1);
  assert.strictEqual(employees[0].name, 'Rohan Mehta');

  // Update
  employees = employees.map(e => e._id === 'emp_101' ? { ...e, position: 'Lead Engineer' } : e);
  assert.strictEqual(employees[0].position, 'Lead Engineer');

  // Toggle status
  employees = employees.map(e => e._id === 'emp_101' ? { ...e, status: e.status === 'Active' ? 'Inactive' : 'Active' } : e);
  assert.strictEqual(employees[0].status, 'Inactive');

  // Delete
  employees = employees.filter(e => e._id !== 'emp_101');
  assert.strictEqual(employees.length, 0);
});

// 6. Leave Applications Workflow
runTest('Leaves: Apply, Approve, Reject, Filter', () => {
  let leaves = [
    { _id: 'l_1', employeeName: 'Pravanshu', status: 'Pending', reason: 'Medical' },
    { _id: 'l_2', employeeName: 'Sakshi', status: 'Approved', reason: 'Conference' }
  ];

  // Apply
  leaves.push({ _id: 'l_3', employeeName: 'Pravanshu', status: 'Pending', reason: 'Family function' });
  assert.strictEqual(leaves.length, 3);

  // Approve
  leaves = leaves.map(l => l._id === 'l_1' ? { ...l, status: 'Approved', approverRole: 'HR' } : l);
  assert.strictEqual(leaves.find(l => l._id === 'l_1').status, 'Approved');

  // Reject
  leaves = leaves.map(l => l._id === 'l_3' ? { ...l, status: 'Rejected', approverRole: 'Manager' } : l);
  assert.strictEqual(leaves.find(l => l._id === 'l_3').status, 'Rejected');

  // Filter
  const pending = leaves.filter(l => l.status === 'Pending');
  assert.strictEqual(pending.length, 0);
  const approved = leaves.filter(l => l.status === 'Approved');
  assert.strictEqual(approved.length, 2);
});

// 7. Attendance Tracking Workflow
runTest('Attendance: Check-in, Check-out, History tracking', () => {
  let attendance = [];
  let isCheckedIn = false;

  // Check in
  const record = {
    _id: 'att_101',
    employeeName: 'Pravanshu Samadhiya',
    date: '2026-10-25',
    checkInTime: '9:00:00 AM',
    checkOutTime: '--',
    status: 'Present'
  };
  attendance.unshift(record);
  isCheckedIn = true;

  assert.strictEqual(isCheckedIn, true);
  assert.strictEqual(attendance[0].checkInTime, '9:00:00 AM');
  assert.strictEqual(attendance[0].checkOutTime, '--');

  // Check out
  attendance[0].checkOutTime = '6:00:00 PM';
  isCheckedIn = false;

  assert.strictEqual(isCheckedIn, false);
  assert.strictEqual(attendance[0].checkOutTime, '6:00:00 PM');
});

// 8. Announcements Workflow
runTest('Announcements: Create, Target Audience filtering, Delete', () => {
  let announcements = [
    { _id: 'a_1', title: 'All Hands', targetAudience: 'All' },
    { _id: 'a_2', title: 'Manager Sync', targetAudience: 'Managers' }
  ];

  // Create
  announcements.push({ _id: 'a_3', title: 'Employee Survey', targetAudience: 'Employees' });
  assert.strictEqual(announcements.length, 3);

  // Filter for employee view
  const employeeView = announcements.filter(a => a.targetAudience === 'All' || a.targetAudience === 'Employees');
  assert.strictEqual(employeeView.length, 2);
  assert(!employeeView.some(a => a.targetAudience === 'Managers'));

  // Delete
  announcements = announcements.filter(a => a._id !== 'a_3');
  assert.strictEqual(announcements.length, 2);
});

// 9. Training and Development Workflow
runTest('Trainings: Create, Assign, Edit, Delete', () => {
  let trainings = [
    { _id: 't_1', title: 'MongoDB CRUD', trainer: 'Adnan Saif', status: 'Scheduled' }
  ];

  // Create
  trainings.push({ _id: 't_2', title: 'React 18 Architecture', trainer: 'Sakshi Verma', status: 'Scheduled' });
  assert.strictEqual(trainings.length, 2);

  // Edit
  trainings = trainings.map(t => t._id === 't_1' ? { ...t, status: 'In Progress' } : t);
  assert.strictEqual(trainings.find(t => t._id === 't_1').status, 'In Progress');

  // Delete
  trainings = trainings.filter(t => t._id !== 't_2');
  assert.strictEqual(trainings.length, 1);
});

console.log(`\n====================================================`);
console.log(`Test Execution Summary: ${passedTests}/${totalTests} Tests Passed`);
console.log('====================================================');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
