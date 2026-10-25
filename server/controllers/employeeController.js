const Employee = require('../models/Employee');

// Initial seed mock employees matching PDF screenshots (Pravanshu Samadhiya, etc.)
let memoryEmployees = [
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
  }
];

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({});
    if (employees && employees.length > 0) {
      return res.json(employees);
    }
  } catch (err) {}
  return res.json(memoryEmployees);
};

const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (employee) return res.json(employee);
  } catch (err) {}

  const emp = memoryEmployees.find((e) => e._id === req.params.id);
  if (emp) return res.json(emp);
  res.status(404).json({ message: 'Employee not found' });
};

const createEmployee = async (req, res) => {
  try {
    const { name, email, department, position, salary, joinDate, phone, address } = req.body;
    if (!name || !email || !department || !position) {
      return res.status(400).json({ message: 'Please provide all required employee fields' });
    }

    try {
      const created = await Employee.create({
        name,
        email,
        department,
        position,
        salary: Number(salary) || 0,
        joinDate: joinDate || new Date(),
        phone,
        address
      });
      return res.status(201).json(created);
    } catch (dbErr) {}

    const newEmp = {
      _id: 'emp_' + Date.now(),
      name,
      email,
      department,
      position,
      salary: Number(salary) || 0,
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      phone: phone || '',
      address: address || '',
      status: 'Active'
    };
    memoryEmployees.unshift(newEmp);
    res.status(201).json(newEmp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      const updated = await Employee.findByIdAndUpdate(id, req.body, { new: true });
      if (updated) return res.json(updated);
    } catch (dbErr) {}

    const index = memoryEmployees.findIndex((e) => e._id === id);
    if (index !== -1) {
      memoryEmployees[index] = { ...memoryEmployees[index], ...req.body };
      return res.json(memoryEmployees[index]);
    }

    res.status(404).json({ message: 'Employee not found' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    try {
      await Employee.findByIdAndDelete(id);
    } catch (dbErr) {}

    memoryEmployees = memoryEmployees.filter((e) => e._id !== id);
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
