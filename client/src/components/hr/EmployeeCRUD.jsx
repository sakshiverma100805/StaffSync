import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import {
  Users,
  UserPlus,
  Edit2,
  Trash2,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  X,
  Phone,
  Mail,
  MapPin,
  Briefcase
} from 'lucide-react';

const EmployeeCRUD = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, toggleEmployeeStatus } = useData();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: 'Engineering',
    position: '',
    salary: '',
    joinDate: '',
    phone: '',
    address: ''
  });

  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [notification, setNotification] = useState({ type: '', message: '' });

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEditClick = (emp) => {
    setEditingId(emp._id);
    setFormData({
      name: emp.name,
      email: emp.email,
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      joinDate: emp.joinDate ? emp.joinDate.split('T')[0] : '',
      phone: emp.phone || '',
      address: emp.address || ''
    });
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      department: 'Engineering',
      position: '',
      salary: '',
      joinDate: '',
      phone: '',
      address: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      showNotification('error', 'Please fill in all required fields.');
      return;
    }

    if (editingId) {
      updateEmployee(editingId, formData);
      showNotification('success', `Employee "${formData.name}" updated successfully.`);
      handleCancelEdit();
    } else {
      addEmployee(formData);
      showNotification('success', `Employee "${formData.name}" added successfully.`);
      setFormData({
        name: '',
        email: '',
        department: 'Engineering',
        position: '',
        salary: '',
        joinDate: '',
        phone: '',
        address: ''
      });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to remove employee "${name}"?`)) {
      deleteEmployee(id);
      showNotification('success', `Employee "${name}" has been removed.`);
    }
  };

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...new Set(employees.map((e) => e.department))];

  return (
    <div className="employee-crud-module">
      {notification.message && (
        <div className={`auth-alert ${notification.type} mb-4`}>
          {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Add / Edit Employee Form matching page 56 */}
      <div className="dashboard-section-card mb-6">
        <div className="card-heading-row">
          <div className="heading-with-icon">
            <UserPlus size={20} className="text-blue" />
            <h3>{editingId ? 'Edit Employee Details' : 'Employee Management (Add New)'}</h3>
          </div>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="btn-cancel-edit">
              <X size={14} /> Cancel Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="employee-form-grid">
          <div className="form-group">
            <label htmlFor="emp-name">Name *</label>
            <input
              id="emp-name"
              name="name"
              type="text"
              placeholder="e.g. Pravanshu Samadhiya"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emp-email">Email *</label>
            <input
              id="emp-email"
              name="email"
              type="email"
              placeholder="e.g. Pravanshu@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emp-department">Department *</label>
            <select
              id="emp-department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="select-custom"
            >
              <option value="Engineering">Engineering</option>
              <option value="Human Resources">Human Resources</option>
              <option value="Product">Product</option>
              <option value="Quality Assurance">Quality Assurance</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="emp-position">Position *</label>
            <input
              id="emp-position"
              name="position"
              type="text"
              placeholder="e.g. Full Stack Developer"
              value={formData.position}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emp-salary">Salary (₹/mo or $/yr) *</label>
            <input
              id="emp-salary"
              name="salary"
              type="number"
              placeholder="e.g. 85000"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emp-joinDate">Join Date *</label>
            <input
              id="emp-joinDate"
              name="joinDate"
              type="date"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="emp-phone">Phone Number</label>
            <input
              id="emp-phone"
              name="phone"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="emp-address">Address</label>
            <input
              id="emp-address"
              name="address"
              type="text"
              placeholder="e.g. Sector 62, Noida, UP"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-full-width">
            <button type="submit" className="btn-red-action">
              <UserPlus size={16} />
              <span>{editingId ? 'Update Employee Record' : 'Add Employee'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Employee Table Section */}
      <div className="dashboard-section-card">
        <div className="card-heading-row flex-wrap">
          <div className="heading-with-icon">
            <Users size={20} className="text-blue" />
            <h3>Employee Directory</h3>
          </div>

          {/* Search & Filter Controls */}
          <div className="table-search-filter-row">
            <div className="search-input-box">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, email, role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-select-box">
              <Filter size={15} className="filter-icon" />
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="select-filter"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Departments' : d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Responsive Table matching page 56 */}
        <div className="table-responsive-wrapper">
          <table className="staffsync-data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Salary</th>
                <th>Join Date</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-6 text-muted">
                    No employee records match the given criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td className="font-semibold text-white">{emp.name}</td>
                    <td className="text-blue">{emp.email}</td>
                    <td>
                      <span className="dept-tag">{emp.department}</span>
                    </td>
                    <td>{emp.position}</td>
                    <td className="font-mono">₹{Number(emp.salary).toLocaleString()}</td>
                    <td>
                      {emp.joinDate
                        ? new Date(emp.joinDate).toLocaleDateString('en-US', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : '--'}
                    </td>
                    <td>{emp.phone || '--'}</td>
                    <td className="text-truncate-cell" title={emp.address}>
                      {emp.address || '--'}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => toggleEmployeeStatus(emp._id)}
                        className={`status-chip ${emp.status === 'Active' ? 'chip-active' : 'chip-inactive'}`}
                        title="Click to toggle status"
                      >
                        {emp.status || 'Active'}
                      </button>
                    </td>
                    <td>
                      <div className="table-actions-cell">
                        <button
                          type="button"
                          onClick={() => handleEditClick(emp)}
                          className="btn-action-icon edit-btn"
                          title="Edit employee"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(emp._id, emp.name)}
                          className="btn-action-icon delete-btn"
                          title="Delete employee"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCRUD;
