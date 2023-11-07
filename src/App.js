import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeList from './components/EmployeeList';

function App() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/employee/')
      .then(response => {
        setEmployees(response.data);
      })
      .catch(error => console.error('Error fetching data: ', error));
  }, []);

  return (
    <div className="App">
      <h1>Employee Directory</h1>
      <EmployeeList employees={employees} />
    </div>
  );
}

export default App;