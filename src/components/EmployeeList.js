// EmployeeList.js
import React from 'react';
import './EmployeeList.css';

const EmployeeList = ({ employees }) => {
  return (
    <div className="employee-list-container">
      {employees.map(employee => (
        <div key={employee.EmployeeID} className="employee-card">
          <div className="employee-info">
            <img src={employee.ProfileImage} alt="Profile" className="employee-image"/>
            <div>
              <h2 className="employee-name">{employee.FirstName} {employee.LastName}</h2>
              <p className="employee-details">{employee.position.name}</p>
              <p className="employee-details">{employee.Email}</p>
              <p className="employee-email">
                <a href={`mailto:${employee.Email}`}>Send Email</a>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EmployeeList;