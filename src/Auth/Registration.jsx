import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons
import "./Auth.css";

const Registration = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    if (!email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Invalid email format";
    }

    if (!password) {
      formErrors.password = "Password is required";
    }

    if (!confirmPassword) {
      formErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    if (!role) {
      formErrors.role = "Please select a role";
    }

    return formErrors;
  };

  const handleConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(
          "https://photoshopbackend-q7jc.onrender.com/api/auth/register",
          {
            email,
            password,
            confirmPassword,
            role,
          }
        );
        console.log("Registration Successful:", response.data);
        setSuccessMessage("Registration successful!");

        // Trigger confetti
        handleConfetti();

        // Store success message in localStorage
        localStorage.setItem("successMessage", "Registration successful!");

        // Navigate to home after 4 seconds
        setTimeout(() => {
          navigate("/");

          // Clear local storage message after navigating
          localStorage.removeItem("successMessage");
        }, 4000); // 4 seconds

        // Reset form and errors
        setErrors({});
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRole("");
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          setErrors({ api: error.response.data.message });
        } else {
          setErrors({
            api: "An unexpected error occurred. Please try again later.",
          });
        }
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <>
      <div className="container-fluid regContainer">
        <div className="container d-flex justify-content-center align-items-center min-vh-100">
          <div className="col-12 col-sm-8 col-md-6 col-lg-4">
            <div className="card p-4 regCard">
              <h2 className="text-center mb-4">Sign Up</h2>

              {successMessage && (
                <div className="alert alert-success">{successMessage}</div>
              )}
              {errors.api && (
                <div className="alert alert-danger">{errors.api}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email address
                  </label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className={`form-control ${
                      errors.password ? "is-invalid" : ""
                    }`}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary position-absolute top-51 end-0 translate-middle-y"
                    style={{ marginTop: "-18px" }}
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.password && (
                    <div className="invalid-feedback">{errors.password}</div>
                  )}
                </div>
                <div className="mb-3 position-relative">
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type={confirmPasswordVisible ? "text" : "password"}
                    className={`form-control ${
                      errors.confirmPassword ? "is-invalid" : ""
                    }`}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary position-absolute top-51 end-0 translate-middle-y"
                    style={{ marginTop: "-18px" }}
                    onClick={() =>
                      setConfirmPasswordVisible(!confirmPasswordVisible)
                    }
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  {errors.confirmPassword && (
                    <div className="invalid-feedback">
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <select
                    className={`form-control ${
                      errors.role ? "is-invalid" : ""
                    }`}
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="">Select a role</option>
                    <option value="Photographer">Photographer</option>
                    <option value="user">User</option>
                  </select>
                  {errors.role && (
                    <div className="invalid-feedback">{errors.role}</div>
                  )}
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Register
                </button>
              </form>
              <div className="mt-3">
                <Link to="/" className="linkTag">
                  Already an account?
                  <span className="CRaccount"> Login</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
