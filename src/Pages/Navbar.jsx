import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";

import logo from "../images/logo.jpg";

const Navbar = () => {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Retrieve user details from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setUserEmail(user.email);
    }
  }, []);

  const handleLogout = () => {
    // Clear JWT token and user details from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to the login page
    navigate("/"); // Adjust the path as needed
  };

  // Determine the background color based on the current location
  const getNavLinkClass = (path) => {
    return location.pathname === path ? "nav-link active" : "nav-link";
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light navBarContainer">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" className="image-fluid navImg" />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className={getNavLinkClass("/home")} to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className={getNavLinkClass("/addpage")} to="/addpage">
                  Creative Media
                </Link>
              </li>
              <li className="nav-item">
                <Link className={getNavLinkClass("/webpage1")} to="/webpage1">
                  PhotoVault
                </Link>
              </li>
            </ul>

            <div>
              {userEmail && (
                <p className="nav-item ">
                  <span className="nav-link text-light userName">
                    {userEmail}
                  </span>
                </p>
              )}
            </div>

            <div>
              <ul className="ms-auto">
                <li className="nav-item main">
                  <button
                    className="nav-link btn-link logBtn"
                    onClick={handleLogout}
                  >
                    LogOut
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
