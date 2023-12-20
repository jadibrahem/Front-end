import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/sidebar.jsx';
import Dashboard from './pages/dashboard.jsx';
import EmployeeList from './pages/employeelist.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import LeaveDetailsPage from './pages/leaves.jsx';
import EmployeeDetails from './pages/employeedetail.jsx';
import LeaveRequestForm from './pages/LeaveRequestForm.jsx'; // Import your LeaveRequestForm
import LeaveRequestsList from './pages/leave-requests';
import LeaveRequestDetails from './pages/LeaveRequestDetails.jsx';
import AttendancePage from './pages/AttendancePage';
import AttendanceDashboard from './pages/AttendanceDashboard';
import FormSelectionPage from './pages/FormSelectionPage.jsx';
import EmployeeByNum from './pages/EmployeeByNum.jsx';
import InsuranceNumberInputPage from './pages/InsuranceNumberInputPage'; 
import LeavePdf from './pages/LeavePdf.jsx'; 
import EmployeeLeaveInfo from './pages/EmployeeLeaveInfo.jsx';
import Login from './pages/Login.jsx'
import { ProtectedRoute } from './components/ProtectedRoute.js';
import Insurance from './pages/insurance.jsx';
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? '200px' : '0px'; // Adjust this value based on your sidebar's width

  return (
    <BrowserRouter>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className='mainDiv' style={{ transition: 'margin-left .5s',  }}>
        <Routes>
          <Route path="/" element={<FormSelectionPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dash"   element={<ProtectedRoute component={Dashboard} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employeelist" element={<EmployeeList />} />
          <Route path="/leaves" element={<LeaveDetailsPage />} />
          <Route path="/insrunace" element={<Insurance />} />
          {/* For EmployeeDetails, you will need a parameterized route */}
          <Route path="/employee/:EmployeeID" element={<EmployeeDetails />} />
          <Route path="/EmployeeByNum/:insuranceNumber" element={<EmployeeByNum />} />
          <Route path="/leave-request" element={<LeaveRequestForm />} /> {/* Add this line */}
          <Route path="/leave-requests" element={<LeaveRequestsList />} />
          <Route path="/leave-requests/:id" element={<LeaveRequestDetails />} />
          <Route path="/attendance" element={<AttendancePage />} /> {/* Attendance page route */}
          <Route path="/attendance-dash" element={<AttendanceDashboard />} /> {/* Attendance page route */}
          <Route path="/InsuranceNumberInputPage" element={<InsuranceNumberInputPage />} /> {/* Attendance page route */}
          <Route path="/employee/:insuranceNumber/leaves" element={<EmployeeLeaveInfo />} />
          <Route path="/leavepdf/:leaveId" element={<LeavePdf />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;