import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaThList,
    FaEnvelope,
    FaFile,
    FaPlus,
    FaEdit
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [subnav, setSubnav] = useState(false);
  
    const toggle = () => setIsOpen(!isOpen);
    const showSubnav = (index) => {
      // If index matches subnav, close it; otherwise, open the new one
      setSubnav(subnav === index ? false : index);
    };
  
    const menuItem = [
        {
            path: "/",
            name: "Dashboard",
            icon: <FaTh />
        },
      {
        path: "/employeelist",
        name: "Employee",
        icon: <FaUserAlt />,
        subNav: [
          {
            path: "/employee/add",
            name: "Add Employee",
            icon: <FaPlus />
          },
          {
            path: "/employee/edit",
            name: "Edit Employee",
            icon: <FaEdit />
        },
        {
            path: "/employee/show",
            name: "ShowEmployee",
            icon: <FaUserAlt />
        }
        ]
      },
      {
        path:"/leaves",
        name:"Analytics",
        icon:<FaRegChartBar/>
    },
    {
        path:"/attendance",
        name:"Attendacne",
        icon:<FaFile/>
    },
    {
        path:"/leave-requests",
        name:"REQUESTS",
        icon: <FaEnvelope/>
    },
    {
        path:"/attendance-dash",
        name:" Attendance dash",
        icon:<FaThList/>
    }
    ];
  
    return (
      <div className="container">
        <div style={{ width: isOpen ? "200px" : "50px" }} className="sidebar">
          <div className="top_section">
            <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">HALO TRUST</h1>
            <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          {menuItem.map((item, index) => (
            <React.Fragment key={index}>
              <NavLink to={item.path} className="link" activeClassName="active" onClick={() => item.subNav && showSubnav(index)}>
                <div className="icon">{item.icon}</div>
                <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
              </NavLink>
              {item.subNav && subnav === index && item.subNav.map((subItem, subIndex) => (
                <NavLink to={subItem.path} key={subIndex} className="link" activeClassName="active">
                  <div className="icon">{subItem.icon}</div>
                  <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{subItem.name}</div>
                </NavLink>
              ))}
            </React.Fragment>
          ))}
        </div>
        <main>{children}</main>
      </div>
    );
  };
  
  export default Sidebar;