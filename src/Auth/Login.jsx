import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = true;

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (isValid) {
      try {
        const response = await axios.post(
          "https://photoshopbackend-q7jc.onrender.com/api/auth/login",
          { email, password }
        );
        console.log("Login Successful:", response.data);

        const { token, user } = response.data;

        // Save JWT token and user details to localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "Photographer") {
          navigate("/home"); // Navigate to Photographer's home
        } else if (user.role === "user") {
          navigate("/userhome"); // Navigate to User's home
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setApiError(error.response.data.message);
        } else {
          setApiError("An unexpected error occurred. Please try again later.");
        }
      }
    }
  };

  return (
    <>
      <div className="container-fluid loginContainer">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="card p-4 loginCard">
              <h2 className="text-center mb-4">Login</h2>

              {apiError && <div className="alert alert-danger">{apiError}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${emailError ? "is-invalid" : ""}`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      passwordError ? "is-invalid" : ""
                    }`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                  {passwordError && (
                    <div className="invalid-feedback">{passwordError}</div>
                  )}
                </div>
                <button type="submit" className="btn reg w-100">
                  Login
                </button>
              </form>

              <div className="mt-3">
                <Link to="/reg" className="linkTag">
                  Not Registered?
                  <span className="CRaccount"> Create an account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
