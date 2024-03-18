import React, { useState, useEffect } from 'react';
import {
    FaTh, FaBars, FaUserAlt, FaRegChartBar, FaThList, FaEnvelope, FaFile,
    FaPlus, FaEdit, FaWpforms, FaMoneyBillWave, FaAccessibleIcon, FaDhl, FaDollarSign
} from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import log from '../components/log'; // Ensure this path is correct to your log module

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
 
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const loginType = sessionStorage.getItem('loginType'); 
    const toggle = () => setIsOpen(!isOpen);
    const logoutHandler = () => {
        const isConfirmed = window.confirm("Are you sure you want to logout?");
        if (isConfirmed) {
            log.logout(); // Assuming this function clears the session and user state
            setUser(null);
            sessionStorage.removeItem('loginType'); // Clear any finance-specific session info
            navigate('/'); // Navigate to the homepage after logout
        }
    };

    const logoutMenuItem = {
        // Assign the logoutHandler to the action property
    };
    useEffect(() => {
        const loggedInUser = log.getCurrentUser();
        setUser(loggedInUser);
    }, []);

    const financeLogin = () => {
        navigate('/finance-login'); // Replace with your finance login route
    };

   
    const financeMenu = [
        {
            path: "/FinanceDashboard",
            name: "Finance Dashboard",
            icon: <FaDollarSign />,
            cName: 'nav-text'
        },
        // Additional finance-specific menu items
        {
            path: "/purchas-list",
            name: "Purchase Request",
            icon: <FaFile />,
            cName: 'nav-text'
        }, {
            path: "/rfq-list",
            name: "Quotation Request",
            icon: <FaFile />,
            cName: 'nav-text'
        },
       { path: "/login",
        name: "Logout",
        icon: <FaUserAlt />,
        action: logoutHandler,
    }
       
    ];
    // Menu items for unlogged users
    const unloggedUserMenu = [
        {
            path: "/",
            name: "Home",
            icon: <FaTh />,
            cName: 'nav-text'
        },
        {
            path: "/finance",
            name: "Finance login",
            icon: <FaDollarSign />,
            cName: 'nav-text'
        },
        {
            path: "/login",
            name: "Login TO HR",
            icon: <FaUserAlt />,
            cName: 'nav-text'
        },
        // ...other items for unlogged users
    ];

    // Menu items for logged-in users
    const loggedUserMenu = [
        {
            path: "/dashboard",
            name: "Dashboard",
            icon: <FaTh />,
            cName: 'nav-text'
        },
        {
            path: "/employeelist",
            name: "Employees",
            icon: <FaUserAlt />,
            cName: 'nav-text'
        },
        {
            path: "/leaves",
            name: "Analytics",
            icon: <FaRegChartBar/>
        },
        {
            path: "/attendance",
            name: "Attendance",
            icon: <FaFile/>
        },
        {
            path: "/leave-requests",
            name: "Requests",
            icon: <FaEnvelope/>
        },
        {
            path: "/attendance-dash",
            name: "Attendance Dash",
            icon: <FaThList/>
        }
        // ...other items for logged-in users
    ];
    
    const menuToDisplay = loginType === 'finance' ? financeMenu : (user ? loggedUserMenu : unloggedUserMenu);
    return (
        <div className="container">
            <div className="sidebar" style={{ width: isOpen ? "200px" : "50px" }}>
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">HALO TRUST</h1>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>

                {menuToDisplay.map((item, index) => (
                    <NavLink key={index} to={item.path} className="link" activeClassName="active">
                        <div className="icon">{item.icon}</div>
                        <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                    </NavLink>
                ))}

                {user && (
                    <div className="logout" onClick={logoutHandler}>
                        <NavLink to="/login" className="link" activeClassName="active">
                            <div className="icon"><FaUserAlt /></div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">Logout</div>
                        </NavLink>
                    </div>
                )}
            </div>
            <main>{children}</main>
        </div>
    );
};

export default Sidebar;