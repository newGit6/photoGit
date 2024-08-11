import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../images/logo.jpg";

const UserNav = () => {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

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
              <li className="nav-item"></li>
              <li className="nav-item"></li>
              <li className="nav-item"></li>
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

export default UserNav;
