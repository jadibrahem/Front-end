import React from 'react';
import './EmployeeCard.css';

const EmployeeCard = ({ employee }) => {
  return (
    <div className="employee-card">
      <img src={employee.ProfileImage} alt={`${employee.FirstName} ${employee.LastName}`} />
      <div className="employee-info">
        <h2>{`${employee.FirstName} ${employee.LastName}`}</h2>
        <p>Email: {employee.Email}</p>
        <p>Phone: {employee.Phone}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default EmployeeCard;