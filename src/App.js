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
const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarWidth = sidebarOpen ? '200px' : '0px'; // Adjust this value based on your sidebar's width

  return (
    <BrowserRouter>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ marginLeft: sidebarWidth, transition: 'margin-left .5s',  }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/employeelist" element={<EmployeeList />} />
          <Route path="/leaves" element={<LeaveDetailsPage />} />
          {/* For EmployeeDetails, you will need a parameterized route */}
          <Route path="/employeedetail/:employeeId" element={<EmployeeDetails />} />
          <Route path="/leave-request" element={<LeaveRequestForm />} /> {/* Add this line */}
          <Route path="/leave-requests" element={<LeaveRequestsList />} />
          <Route path="/leave-requests/:id" element={<LeaveRequestDetails />} />
          <Route path="/attendance" element={<AttendancePage />} /> {/* Attendance page route */}
          <Route path="/attendance-dash" element={<AttendanceDashboard />} /> {/* Attendance page route */}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;