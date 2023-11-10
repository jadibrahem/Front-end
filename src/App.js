// // App.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import EmployeeList from './components/EmployeeList';
// import './App.css'; // Ensure you have this CSS import for styles

// const Header = () => {
//   return <div className="header">Company Header</div>;
// };

// const Sidebar = () => {
//   return (
//     <div className="sidebar">
//       <a href="#home">Home</a>
//       <a href="#employees">Employees</a>
//       <a href="#departments">Departments</a>
//       <a href="#reports">Reports</a>
//       {/* Add more links as needed */}
//     </div>
//   );
// };

// function App() {
//   const [employees, setEmployees] = useState([]);

//   useEffect(() => {
//     axios.get('http://127.0.0.1:8000/employee/')
//       .then(response => {
//         setEmployees(response.data);
//       })
//       .catch(error => console.error('Error fetching data: ', error));
//   }, []);

//   return (
//     <div>
//       <Header />
//       <Sidebar />
//       <div className="main-content">
//         <h1>Employee Directory</h1>
//         <EmployeeList employees={employees} />
//       </div>
//     </div>
//   );
// }

// export default App;
// App.js or your page component
import React from 'react';
import LeaveRequestForm from './LeaveRequestForm';
import './LeaveRequestForm';
function App() {
  return (
    <div className="App">
      <h1>Leave Request Form</h1>
      <LeaveRequestForm />
    </div>
  );
}

export default App;