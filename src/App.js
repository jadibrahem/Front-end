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
import QRCodePage from './components/QRCodePage';
import Insurance from './pages/insurance.jsx';
import QRScanPage from './pages/QRScanPage.jsx';
import TeamDetailsPage from './pages/teams/team.jsx';
import FinanceLogin from './pages/finance/finlog.jsx';
import PurchaseRequestForm from './pages/finance/PurchaseRequestForm.jsx';
import PurchaseRequestList from './pages/finance/PurchaseRequestList.jsx';
import PurchaseRequestDetail from './pages/finance/PurchaseRequestDetail.jsx';
// import AuthRouteWrapper from '.pages/finance/AuthRouteWrapper.js
import { Protected } from './pages/finance/Protected';

import { AuthProvider } from './pages/finance/AuthContext.js';

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);


  return (
    <AuthProvider>
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

          <Route path="/qr-code/:insuranceNumber" element={<QRCodePage />} />
          <Route path="/scan-qr-code" element={<QRScanPage />} />

          <Route path="/teams" element={<TeamDetailsPage />} />

          <Route path="/finance" element={<FinanceLogin />} />
          <Route path="/purchas-requests" element={<PurchaseRequestForm />} />
          <Route path="/purchas-requests/:requestId" element={<PurchaseRequestDetail />} />
          <Route path="/purchas-list"   element={<PurchaseRequestList />} />
        </Routes>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
};

export default App;