import React, { useState, useEffect } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaThList,
    FaEnvelope,
    FaFile,
    FaPlus,
    FaEdit,
    FaWpforms,
} from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router-dom';
import log from '../components/log'; // Make sure this path is correct

const Sidebar = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [subnav, setSubnav] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const toggle = () => setIsOpen(!isOpen);
    const showSubnav = (index) => setSubnav(subnav === index ? false : index);

    useEffect(() => {
        const loggedInUser = log.getCurrentUser();
        setUser(loggedInUser);
    }, []);

    // Menu items for unlogged users
    const unloggedUserMenu = [
        {
            path: "/",
            name: "Forms",
            icon: <FaWpforms />,
            cName: 'nav-text'
        },
        {
            path: "/login",
            name: "Login",
            icon: <FaUserAlt />,
            cName: 'nav-text'
        },
        // ...other items for unlogged users
    ];

    // Menu items for logged-in users
    let loggedUserMenu = [
        {
            path: "/dash",
            name: "Dashboard",
            icon: <FaTh />,
            cName: 'nav-text'
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
                    name: "Show Employee",
                    icon: <FaUserAlt />
                }
            ]
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

    const logoutHandler = () => {
        log.logout();
        setUser(null);
        navigate('/login');
    };

    return (
        <div className="container">
            <div className="sidebar" style={{ width: isOpen ? "200px" : "50px" }}>
                <div className="top_section">
                    <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">HALO TRUST</h1>
                    <div style={{ marginLeft: isOpen ? "50px" : "0px" }} className="bars">
                        <FaBars onClick={toggle} />
                    </div>
                </div>
                {user ? loggedUserMenu.map((item, index) => (
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
                )) : unloggedUserMenu.map((item, index) => (
                    <React.Fragment key={index}>
                        <NavLink to={item.path} className="link" activeClassName="active" onClick={() => item.subNav && showSubnav(index)}>
                            <div className="icon">{item.icon}</div>
                            <div style={{ display: isOpen ? "block" : "none" }} className="link_text">{item.name}</div>
                        </NavLink>
                    </React.Fragment>
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