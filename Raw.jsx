import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Calendar, Clock, FileText, CheckCircle, XCircle, AlertCircle, 
  BarChart2, PieChart, UserPlus, Search, Filter, Edit, Trash2, Eye, 
  Check, X, LogIn, LogOut, Shield, Database, UserCheck, ChevronRight,
  Briefcase, DollarSign, FileCheck, Phone, Mail, MapPin, Award, ArrowUpRight,
  Plus, Settings, RefreshCw, Bell, Layers, Download, Lock
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RePieChart, Pie, Cell, Legend 
} from 'recharts';

// --- MOCK DATABASE INITIAL STATE ---
const INITIAL_DEPARTMENTS = ['Engineering', 'Human Resources', 'Marketing', 'Sales', 'Finance', 'Design'];

const INITIAL_EMPLOYEES = [
  {
    id: 'EMP-001',
    name: 'Shiva Gupta',
    email: 'shivagupta9940@gmail.com',
    role: 'Admin',
    department: 'Human Resources',
    designation: 'VP of People Operations',
    status: 'Active',
    joinDate: '2021-03-15',
    salary: '$125,000',
    phone: '+1 (555) 234-5678',
    location: 'New Delhi, India',
    emergencyContact: 'Mark Jenkins (Spouse) - +1 (555) 999-8888',
    leaveBalances: { casual: 10, sick: 8, earned: 14 }
  },
  {
    id: 'EMP-002',
    name: 'Alex Rivera',
    email: 'alex.r@company.com',
    role: 'HR Manager',
    department: 'Human Resources',
    designation: 'Senior HR Specialist',
    status: 'Active',
    joinDate: '2022-01-10',
    salary: '$85,000',
    phone: '+1 (555) 345-6789',
    location: 'Austin, TX',
    emergencyContact: 'Elena Rivera (Sister) - +1 (555) 888-7777',
    leaveBalances: { casual: 7, sick: 10, earned: 12 }
  },
  {
    id: 'EMP-003',
    name: 'David Chen',
    email: 'david.c@company.com',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Lead Frontend Engineer',
    status: 'Active',
    joinDate: '2020-06-01',
    salary: '$140,000',
    phone: '+1 (555) 456-7890',
    location: 'San Francisco, CA',
    emergencyContact: 'Lian Chen (Mother) - +1 (555) 777-6666',
    leaveBalances: { casual: 5, sick: 6, earned: 15 }
  },
  {
    id: 'EMP-004',
    name: 'Emily Watson',
    email: 'emily.w@company.com',
    role: 'Employee',
    department: 'Marketing',
    designation: 'Content Strategy Manager',
    status: 'On Leave',
    joinDate: '2022-08-20',
    salary: '$78,000',
    phone: '+1 (555) 567-8901',
    location: 'Chicago, IL',
    emergencyContact: 'John Watson (Father) - +1 (555) 666-5555',
    leaveBalances: { casual: 2, sick: 4, earned: 10 }
  },
  {
    id: 'EMP-005',
    name: 'Michael Chang',
    email: 'michael.c@company.com',
    role: 'Employee',
    department: 'Finance',
    designation: 'Financial Analyst',
    status: 'Active',
    joinDate: '2023-02-14',
    salary: '$92,000',
    phone: '+1 (555) 678-9012',
    location: 'New York, USA',
    emergencyContact: 'Susan Chang (Spouse) - +1 (555) 555-4444',
    leaveBalances: { casual: 8, sick: 9, earned: 11 }
  }
];

const INITIAL_ATTENDANCE = [
  { id: 1, empId: 'EMP-001', name: 'Sarah Jenkins', date: '2026-10-26', clockIn: '08:55 AM', clockOut: '05:05 PM', hours: '8h 10m', status: 'Present' },
  { id: 2, empId: 'EMP-002', name: 'Alex Rivera', date: '2026-10-26', clockIn: '09:02 AM', clockOut: '05:00 PM', hours: '7h 58m', status: 'Present' },
  { id: 3, empId: 'EMP-003', name: 'David Chen', date: '2026-10-26', clockIn: '09:42 AM', clockOut: '--:--', hours: 'Ongoing', status: 'Late' },
  { id: 4, empId: 'EMP-004', name: 'Emily Watson', date: '2026-10-26', clockIn: '--:--', clockOut: '--:--', hours: '0h', status: 'Absent' },
  { id: 5, empId: 'EMP-005', name: 'Michael Chang', date: '2026-10-26', clockIn: '09:00 AM', clockOut: '01:00 PM', hours: '4h 00m', status: 'Half-Day' },
];

const INITIAL_LEAVES = [
  { id: 'LV-101', empId: 'EMP-004', name: 'Emily Watson', department: 'Marketing', type: 'Casual Leave', startDate: '2026-10-26', endDate: '2026-10-28', days: 3, reason: 'Family engagement out of state', status: 'Pending', appliedOn: '2026-10-22' },
  { id: 'LV-102', empId: 'EMP-003', name: 'David Chen', department: 'Engineering', type: 'Sick Leave', startDate: '2026-11-02', endDate: '2026-11-03', days: 2, reason: 'Dental surgery and recovery', status: 'Pending', appliedOn: '2026-10-25' },
  { id: 'LV-103', empId: 'EMP-005', name: 'Michael Chang', department: 'Finance', type: 'Paid Leave', startDate: '2026-09-10', endDate: '2026-09-15', days: 5, reason: 'Annual vacation', status: 'Approved', appliedOn: '2026-09-01' },
  { id: 'LV-104', empId: 'EMP-002', name: 'Alex Rivera', department: 'Human Resources', type: 'Casual Leave', startDate: '2026-08-05', endDate: '2026-08-06', days: 2, reason: 'Personal emergency', status: 'Rejected', appliedOn: '2026-08-01' },
];

const ATTENDANCE_TREND_DATA = [
  { day: 'Mon', Present: 94, Late: 4, Absent: 2 },
  { day: 'Tue', Present: 96, Late: 2, Absent: 2 },
  { day: 'Wed', Present: 91, Late: 6, Absent: 3 },
  { day: 'Thu', Present: 98, Late: 1, Absent: 1 },
  { day: 'Fri', Present: 88, Late: 7, Absent: 5 },
];

const DEPARTMENT_DISTRIBUTION = [
  { name: 'Engineering', value: 35, color: '#4F46E5' },
  { name: 'Human Resources', value: 15, color: '#10B981' },
  { name: 'Marketing', value: 20, color: '#F59E0B' },
  { name: 'Finance', value: 15, color: '#6366F1' },
  { name: 'Sales & Design', value: 15, color: '#EC4899' },
];

const SQL_SCHEMA_REFERENCE = `-- PostgreSQL Database Schema for HRMS Backend

-- 1. Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users / Employees Table
CREATE TABLE users (
    id VARCHAR(20) PRIMARY KEY, -- e.g., EMP-001
    name VARCHAR(150) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('Admin', 'HR Manager', 'Employee')) DEFAULT 'Employee',
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    designation VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'Active',
    join_date DATE NOT NULL,
    salary DECIMAL(12, 2) NOT NULL,
    phone VARCHAR(30),
    location VARCHAR(150),
    emergency_contact TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Attendance Logs
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    clock_in TIME,
    clock_out TIME,
    total_hours VARCHAR(20),
    status VARCHAR(20) CHECK (status IN ('Present', 'Late', 'Absent', 'Half-Day')),
    UNIQUE(user_id, date)
);

-- 4. Leave Applications
CREATE TABLE leaves (
    id VARCHAR(20) PRIMARY KEY, -- e.g., LV-101
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) CHECK (status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
    applied_on DATE DEFAULT CURRENT_DATE,
    reviewed_by VARCHAR(20) REFERENCES users(id)
);

-- 5. Leave Balances
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(20) REFERENCES users(id) ON DELETE CASCADE,
    casual_leave INT DEFAULT 12,
    sick_leave INT DEFAULT 10,
    earned_leave INT DEFAULT 15,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

export default function App() {
  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState(INITIAL_EMPLOYEES[0]); // Default: Admin (Sarah)
  const [userRole, setUserRole] = useState('Admin'); // 'Admin' | 'HR Manager' | 'Employee'

  // Application Dynamic State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);

  // Clock Widget Live State
  const [clockedIn, setClockedIn] = useState(false);
  const [clockStartTime, setClockStartTime] = useState(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Modals & UI States
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Search & Filter States
  const [empSearch, setEmpSearch] = useState('');
  const [empDeptFilter, setEmpDeptFilter] = useState('All');
  const [empRoleFilter, setEmpRoleFilter] = useState('All');

  // New Employee Form State
  const [newEmp, setNewEmp] = useState({
    name: '', email: '', role: 'Employee', department: 'Engineering',
    designation: '', salary: '$80,000', phone: '', location: 'Headquarters'
  });

  // Leave Form State
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave', startDate: '', endDate: '', reason: ''
  });

  // Handle Switch User / Role
  const handleRoleChange = (role) => {
    setUserRole(role);
    if (role === 'Admin') setCurrentUser(INITIAL_EMPLOYEES[0]);
    else if (role === 'HR Manager') setCurrentUser(INITIAL_EMPLOYEES[1]);
    else setCurrentUser(INITIAL_EMPLOYEES[2]); // David Chen (Employee)
  };

  // Clocking functionality timer
  useEffect(() => {
    let interval = null;
    if (clockedIn) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [clockedIn]);

  const handleClockToggle = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (!clockedIn) {
      setClockedIn(true);
      setClockStartTime(now);
      // Add new attendance record
      const newRecord = {
        id: attendance.length + 1,
        empId: currentUser.id,
        name: currentUser.name,
        date: now.toISOString().split('T')[0],
        clockIn: timeStr,
        clockOut: '--:--',
        hours: '0h 0m',
        status: now.getHours() >= 10 ? 'Late' : 'Present'
      };
      setAttendance([newRecord, ...attendance]);
    } else {
      setClockedIn(false);
      // Update existing record
      setAttendance(attendance.map(item => {
        if (item.empId === currentUser.id && item.clockOut === '--:--') {
          const totalHours = Math.floor(timerSeconds / 3600);
          const totalMins = Math.floor((timerSeconds % 3600) / 60);
          return {
            ...item,
            clockOut: timeStr,
            hours: `${totalHours}h ${totalMins}m`
          };
        }
        return item;
      }));
      setTimerSeconds(0);
    }
  };

  const formatTimer = (sec) => {
    const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
    const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const secs = (sec % 60).toString().padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  // Employee CRUD operations
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const createdEmp = {
      ...newEmp,
      id: `EMP-00${employees.length + 1}`,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      emergencyContact: 'Not specified',
      leaveBalances: { casual: 12, sick: 10, earned: 15 }
    };
    setEmployees([...employees, createdEmp]);
    setIsAddEmployeeModalOpen(false);
    setNewEmp({ name: '', email: '', role: 'Employee', department: 'Engineering', designation: '', salary: '$80,000', phone: '', location: 'Headquarters' });
  };

  const handleDeleteEmployee = (id) => {
    if (confirm('Are you sure you want to remove this employee record?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  // Leave Management Handlers
  const handleApplyLeave = (e) => {
    e.preventDefault();
    const start = new Date(leaveForm.startDate);
    const end = new Date(leaveForm.endDate);
    const timeDiff = Math.abs(end - start);
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1 || 1;

    const newLeaveReq = {
      id: `LV-${Math.floor(100 + Math.random() * 900)}`,
      empId: currentUser.id,
      name: currentUser.name,
      department: currentUser.department,
      type: leaveForm.type,
      startDate: leaveForm.startDate,
      endDate: leaveForm.endDate,
      days: days,
      reason: leaveForm.reason,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0]
    };

    setLeaves([newLeaveReq, ...leaves]);
    setIsApplyLeaveModalOpen(false);
    setLeaveForm({ type: 'Casual Leave', startDate: '', endDate: '', reason: '' });
  };

  const handleUpdateLeaveStatus = (id, newStatus) => {
    setLeaves(leaves.map(l => l.id === id ? { ...l, status: newStatus } : l));
  };

  // Filter Employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(empSearch.toLowerCase()) || 
                            emp.email.toLowerCase().includes(empSearch.toLowerCase()) ||
                            emp.designation.toLowerCase().includes(empSearch.toLowerCase());
      const matchesDept = empDeptFilter === 'All' || emp.department === empDeptFilter;
      const matchesRole = empRoleFilter === 'All' || emp.role === empRoleFilter;
      return matchesSearch && matchesDept && matchesRole;
    });
  }, [employees, empSearch, empDeptFilter, empRoleFilter]);

  // Login Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-slate-100">
        <div className="w-full max-w-md bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 p-8">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="bg-indigo-600 p-3 rounded-xl text-white">
              <Briefcase className="w-8 h-8" />
            </div>
            <span className="text-2xl font-bold tracking-wide text-white">HRMS Portal</span>
          </div>

          <h2 className="text-xl font-bold mb-2 text-center text-slate-200">Welcome Back</h2>
          <p className="text-sm text-slate-400 text-center mb-6">Select a demo account to access the workspace</p>

          <div className="space-y-3 mb-6">
            <button 
              onClick={() => { handleRoleChange('Admin'); setIsAuthenticated(true); }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition"
            >
              <div className="text-left">
                <p className="font-medium text-slate-100">Sarah Jenkins (Admin)</p>
                <p className="text-xs text-slate-400">VP of People Operations</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">Admin</span>
            </button>

            <button 
              onClick={() => { handleRoleChange('HR Manager'); setIsAuthenticated(true); }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition"
            >
              <div className="text-left">
                <p className="font-medium text-slate-100">Alex Rivera (HR Manager)</p>
                <p className="text-xs text-slate-400">Senior HR Specialist</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">HR Manager</span>
            </button>

            <button 
              onClick={() => { handleRoleChange('Employee'); setIsAuthenticated(true); }}
              className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 transition"
            >
              <div className="text-left">
                <p className="font-medium text-slate-100">David Chen (Employee)</p>
                <p className="text-xs text-slate-400">Lead Frontend Engineer</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">Employee</span>
            </button>
          </div>

          <button 
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition shadow-lg shadow-indigo-600/30"
          >
            Sign In to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand Header */}
          <div className="p-6 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Briefcase className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">Pulse HRMS</span>
            </div>
          </div>

          {/* User Persona Profile Badge */}
          <div className="p-4 mx-3 my-4 bg-slate-800/60 rounded-xl border border-slate-700/60 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold border border-indigo-500/30">
              {currentUser.name.charAt(0)}
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-sm font-semibold truncate text-slate-100">{currentUser.name}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.designation}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart2, roles: ['Admin', 'HR Manager', 'Employee'] },
              { id: 'employees', label: 'Employees', icon: Users, roles: ['Admin', 'HR Manager'] },
              { id: 'attendance', label: 'Attendance', icon: Clock, roles: ['Admin', 'HR Manager', 'Employee'] },
              { id: 'leaves', label: 'Leave Requests', icon: Calendar, roles: ['Admin', 'HR Manager', 'Employee'] },
              { id: 'profile', label: 'My Profile', icon: UserCheck, roles: ['Admin', 'HR Manager', 'Employee'] },
              { id: 'sql-reference', label: 'PostgreSQL Schema', icon: Database, roles: ['Admin', 'HR Manager', 'Employee'] },
            ]
            .filter(item => item.roles.includes(userRole))
            .map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-y-auto">
        
        {/* TOP BAR & ROLE SWITCHER */}
        <header className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-100 capitalize">{activeTab.replace('-', ' ')}</h1>
            <p className="text-xs text-slate-400">Welcome back, {currentUser.name}</p>
          </div>

          {/* Interactive Dynamic Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-medium px-2 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> RBAC Switcher:
            </span>
            {(['Admin', 'HR Manager', 'Employee']).map((role) => (
              <button
                key={role}
                onClick={() => handleRoleChange(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  userRole === role 
                    ? 'bg-indigo-600 text-white shadow' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </header>

        {/* DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="p-6 space-y-6">
            
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">Total Workforce</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">{employees.length}</p>
                  <span className="inline-flex items-center text-xs text-emerald-400 mt-1">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2 this month
                  </span>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">On Leave Today</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">
                    {leaves.filter(l => l.status === 'Approved').length}
                  </p>
                  <span className="text-xs text-slate-500 mt-1 block">Scheduled approvals</span>
                </div>
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">Today's Attendance</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">94.2%</p>
                  <span className="inline-flex items-center text-xs text-emerald-400 mt-1">
                    <CheckCircle className="w-3 h-3 mr-0.5" /> Normal range
                  </span>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400">Pending Leave Requests</p>
                  <p className="text-2xl font-bold text-slate-100 mt-1">
                    {leaves.filter(l => l.status === 'Pending').length}
                  </p>
                  <span className="text-xs text-amber-400 mt-1 block font-medium">Requires action</span>
                </div>
                <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Live Timer Widget */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Clock Widget */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-200">Attendance Punch</h3>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${clockedIn ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                      {clockedIn ? 'Clocked In' : 'Clocked Out'}
                    </span>
                  </div>
                  <div className="text-center py-4 bg-slate-950 rounded-xl border border-slate-800/80 mb-4">
                    <p className="text-3xl font-mono font-bold text-indigo-400 tracking-wider">
                      {clockedIn ? formatTimer(timerSeconds) : '00:00:00'}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {clockedIn ? 'Shift duration active' : 'Ready for shift'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClockToggle}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition flex items-center justify-center space-x-2 ${
                    clockedIn 
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>{clockedIn ? 'Clock Out Shift' : 'Clock In Shift'}</span>
                </button>
              </div>

              {/* Interactive Charts - Trends */}
              <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-semibold text-slate-200 mb-4">Weekly Attendance Trends (%)</h3>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={ATTENDANCE_TREND_DATA}>
                      <defs>
                        <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="day" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                      <Area type="monotone" dataKey="Present" stroke="#4F46E5" fillOpacity={1} fill="url(#colorPresent)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Department Distribution & Activity Stream */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Department Pie Chart */}
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-semibold text-slate-200 mb-4">Department Distribution</h3>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={DEPARTMENT_DISTRIBUTION}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {DEPARTMENT_DISTRIBUTION.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activity Feed */}
              <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <h3 className="font-semibold text-slate-200 mb-4">Recent HR Activity Feed</h3>
                <div className="space-y-4">
                  {[
                    { title: 'Leave Approved', desc: 'Michael Chang approved 5 days Paid Leave', time: '10 mins ago', icon: CheckCircle, color: 'text-emerald-400 bg-emerald-500/10' },
                    { title: 'New Employee Added', desc: 'Sarah Jenkins registered David Chen to Engineering', time: '1 hour ago', icon: UserPlus, color: 'text-indigo-400 bg-indigo-500/10' },
                    { title: 'Clock-in Flag', desc: 'David Chen logged clock-in status as Late (09:42 AM)', time: '2 hours ago', icon: AlertCircle, color: 'text-amber-400 bg-amber-500/10' }
                  ].map((act, i) => {
                    const ActIcon = act.icon;
                    return (
                      <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                        <div className={`p-2 rounded-lg ${act.color}`}>
                          <ActIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-slate-200">{act.title}</p>
                          <p className="text-xs text-slate-400">{act.desc}</p>
                        </div>
                        <span className="text-xs text-slate-500">{act.time}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* EMPLOYEE MANAGEMENT VIEW */}
        {activeTab === 'employees' && (
          <div className="p-6 space-y-6">
            
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search employee..."
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-64"
                  />
                </div>

                <select
                  value={empDeptFilter}
                  onChange={(e) => setEmpDeptFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Departments</option>
                  {INITIAL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select
                  value={empRoleFilter}
                  onChange={(e) => setEmpRoleFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>

              {(userRole === 'Admin' || userRole === 'HR Manager') && (
                <button
                  onClick={() => setIsAddEmployeeModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Employee</span>
                </button>
              )}
            </div>

            {/* Employee Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Department & Designation</th>
                      <th className="px-6 py-4">Role</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Salary</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                            {emp.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-100">{emp.name}</p>
                            <p className="text-xs text-slate-400">{emp.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-slate-200">{emp.designation}</p>
                          <p className="text-xs text-slate-400">{emp.department}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            emp.role === 'Admin' ? 'bg-purple-500/20 text-purple-300' :
                            emp.role === 'HR Manager' ? 'bg-emerald-500/20 text-emerald-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {emp.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            emp.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${emp.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-200">{emp.salary}</td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button 
                            onClick={() => { setSelectedEmployee(emp); setIsViewProfileModalOpen(true); }}
                            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                            title="View Profile"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(userRole === 'Admin' || userRole === 'HR Manager') && (
                            <button 
                              onClick={() => handleDeleteEmployee(emp.id)}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE MANAGEMENT VIEW */}
        {activeTab === 'attendance' && (
          <div className="p-6 space-y-6">
            
            {/* Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Present Today</p>
                  <p className="text-xl font-bold text-slate-100">
                    {attendance.filter(a => a.status === 'Present').length} Staff
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Late Arrivals</p>
                  <p className="text-xl font-bold text-slate-100">
                    {attendance.filter(a => a.status === 'Late').length} Staff
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 flex items-center space-x-4">
                <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Absents / On Leave</p>
                  <p className="text-xl font-bold text-slate-100">
                    {attendance.filter(a => a.status === 'Absent').length} Staff
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Logs Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-semibold text-slate-200">Daily Attendance Logs</h3>
                <span className="text-xs text-slate-400 font-mono">Date: 2026-10-26</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Clock In</th>
                      <th className="px-6 py-4">Clock Out</th>
                      <th className="px-6 py-4">Working Hours</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {attendance.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4 font-medium text-slate-100">{log.name}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-300">{log.clockIn}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-300">{log.clockOut}</td>
                        <td className="px-6 py-4 font-mono text-xs text-indigo-400">{log.hours}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            log.status === 'Present' ? 'bg-emerald-500/20 text-emerald-400' :
                            log.status === 'Late' ? 'bg-amber-500/20 text-amber-400' :
                            log.status === 'Half-Day' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-rose-500/20 text-rose-400'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* LEAVE MANAGEMENT VIEW */}
        {activeTab === 'leaves' && (
          <div className="p-6 space-y-6">
            
            {/* Leave Balance Header Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">Casual Leave Balance</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {currentUser.leaveBalances.casual} <span className="text-xs font-normal text-slate-500">/ 12 Available</span>
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">Sick Leave Balance</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {currentUser.leaveBalances.sick} <span className="text-xs font-normal text-slate-500">/ 10 Available</span>
                </p>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs text-slate-400">Earned / Paid Leave</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">
                  {currentUser.leaveBalances.earned} <span className="text-xs font-normal text-slate-500">/ 15 Available</span>
                </p>
              </div>
            </div>

            {/* Leave Actions Bar */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-200">Leave Applications</h3>
              <button
                onClick={() => setIsApplyLeaveModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                <span>Apply for Leave</span>
              </button>
            </div>

            {/* Leave Applications Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Employee</th>
                      <th className="px-6 py-4">Leave Details</th>
                      <th className="px-6 py-4">Duration</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Status</th>
                      {(userRole === 'Admin' || userRole === 'HR Manager') && <th className="px-6 py-4 text-right">Approval Actions</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {leaves.map((leave) => (
                      <tr key={leave.id} className="hover:bg-slate-800/40 transition">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-100">{leave.name}</p>
                          <p className="text-xs text-slate-400">{leave.department}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-200">{leave.type}</p>
                          <p className="text-xs text-slate-400">{leave.startDate} to {leave.endDate}</p>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-indigo-400">{leave.days} Day(s)</td>
                        <td className="px-6 py-4 text-xs text-slate-400 max-w-xs truncate">{leave.reason}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            leave.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' :
                            leave.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>
                            {leave.status}
                          </span>
                        </td>
                        {(userRole === 'Admin' || userRole === 'HR Manager') && (
                          <td className="px-6 py-4 text-right space-x-2">
                            {leave.status === 'Pending' ? (
                              <>
                                <button
                                  onClick={() => handleUpdateLeaveStatus(leave.id, 'Approved')}
                                  className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition"
                                  title="Approve Leave"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleUpdateLeaveStatus(leave.id, 'Rejected')}
                                  className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition"
                                  title="Reject Leave"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <span className="text-xs text-slate-500">Processed</span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* EMPLOYEE PROFILE HUB */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              
              {/* Header profile banner */}
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 pb-6 border-b border-slate-800">
                <div className="w-20 h-20 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-3xl shadow-xl">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-slate-100">{currentUser.name}</h2>
                  <p className="text-sm text-slate-400">{currentUser.designation} • {currentUser.department}</p>
                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300">
                      ID: {currentUser.id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                      {currentUser.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Information Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* Personal Information */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
                  <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-indigo-400" /> Personal Details
                  </h3>
                  <div className="text-sm space-y-2">
                    <p className="flex justify-between"><span className="text-slate-400">Email:</span> <span className="text-slate-200">{currentUser.email}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Phone:</span> <span className="text-slate-200">{currentUser.phone}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Location:</span> <span className="text-slate-200">{currentUser.location}</span></p>
                  </div>
                </div>

                {/* Job & Compensation Details */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3">
                  <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-indigo-400" /> Career & Salary
                  </h3>
                  <div className="text-sm space-y-2">
                    <p className="flex justify-between"><span className="text-slate-400">Role:</span> <span className="text-slate-200">{currentUser.role}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Join Date:</span> <span className="text-slate-200">{currentUser.joinDate}</span></p>
                    <p className="flex justify-between"><span className="text-slate-400">Base Compensation:</span> <span className="text-emerald-400 font-mono font-medium">{currentUser.salary}</span></p>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800/80 space-y-3 md:col-span-2">
                  <h3 className="font-semibold text-slate-200 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-indigo-400" /> Emergency Contact Info
                  </h3>
                  <p className="text-sm text-slate-300">{currentUser.emergencyContact}</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* SQL / DATABASE SCHEMA VISUALIZER VIEW */}
        {activeTab === 'sql-reference' && (
          <div className="p-6 space-y-4">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-400" /> PostgreSQL Schema Script
                  </h3>
                  <p className="text-xs text-slate-400">Directly executable SQL script to initialize tables for Next.js / Prisma / Drizzle backend integrations</p>
                </div>
              </div>
              
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed">
                {SQL_SCHEMA_REFERENCE}
              </pre>
            </div>
          </div>
        )}

      </main>

      {/* MODAL: ADD EMPLOYEE */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Add New Employee</h3>
              <button onClick={() => setIsAddEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text" required
                  value={newEmp.name}
                  onChange={e => setNewEmp({...newEmp, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                  <input
                    type="email" required
                    value={newEmp.email}
                    onChange={e => setNewEmp({...newEmp, email: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Department</label>
                  <select
                    value={newEmp.department}
                    onChange={e => setNewEmp({...newEmp, department: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {INITIAL_DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Designation</label>
                  <input
                    type="text" required
                    value={newEmp.designation}
                    onChange={e => setNewEmp({...newEmp, designation: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                    placeholder="Senior Developer"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
                  <select
                    value={newEmp.role}
                    onChange={e => setNewEmp({...newEmp, role: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Employee">Employee</option>
                    <option value="HR Manager">HR Manager</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APPLY FOR LEAVE */}
      {isApplyLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Apply for Leave</h3>
              <button onClick={() => setIsApplyLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={e => setLeaveForm({...leaveForm, type: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Paid Leave">Paid Leave</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Start Date</label>
                  <input
                    type="date" required
                    value={leaveForm.startDate}
                    onChange={e => setLeaveForm({...leaveForm, startDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">End Date</label>
                  <input
                    type="date" required
                    value={leaveForm.endDate}
                    onChange={e => setLeaveForm({...leaveForm, endDate: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Reason</label>
                <textarea
                  required rows="3"
                  value={leaveForm.reason}
                  onChange={e => setLeaveForm({...leaveForm, reason: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  placeholder="State your reason for leave..."
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end space-x-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsApplyLeaveModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-indigo-600/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW PROFILE */}
      {isViewProfileModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-100">Employee Card</h3>
              <button onClick={() => setIsViewProfileModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xl">
                  {selectedEmployee.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">{selectedEmployee.name}</h4>
                  <p className="text-xs text-slate-400">{selectedEmployee.designation}</p>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-500/20 text-indigo-300 inline-block mt-1">
                    {selectedEmployee.id}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm bg-slate-950 p-4 rounded-xl border border-slate-800">
                <p className="flex justify-between"><span className="text-slate-400">Department:</span> <span className="text-slate-200">{selectedEmployee.department}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Role:</span> <span className="text-slate-200">{selectedEmployee.role}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Email:</span> <span className="text-slate-200">{selectedEmployee.email}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Join Date:</span> <span className="text-slate-200">{selectedEmployee.joinDate}</span></p>
                <p className="flex justify-between"><span className="text-slate-400">Salary:</span> <span className="text-emerald-400 font-mono font-medium">{selectedEmployee.salary}</span></p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsViewProfileModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}