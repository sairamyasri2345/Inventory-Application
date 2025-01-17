import React, { useState } from 'react';
import "./login.css";
import { Link, useNavigate } from 'react-router-dom';

const EmpLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkError, setCheckError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;

    if (!email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!isChecked) {
      setCheckError("Please check this box if you want to proceed");
      valid = false;
    } else {
      setCheckError("");
    }

    return valid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch("http://localhost:3001/getEmployeeDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (data.status === 'ok') {
        // Check if the entered password matches the one stored in the admin database
        if (data.employee.password === password) {
          // Store necessary employee data in local storage
          window.localStorage.setItem('employeeId', data.employee.employeeId);
          window.localStorage.setItem('email', data.employee.email);
           window.localStorage.setItem('token', data.token);
          // Redirect to dashboard
          navigate("/layout/dashboard");
        } else {
          alert("Incorrect password. Please try again.");
        }
      } else {
        alert("Employee not found. Please check your email.");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("An error occurred while logging in. Please try again.");
    }
  };

  return (
    <div className="container-fluid signup-cont d-flex align-items-center justify-content-center vh-100 p-5">
      <div className="row justify-content-center w-100">
        <div className="col-lg-11 d-flex justify-content-center align-items-center">
          <div className="form-container d-flex flex-column flex-md-row bg-white shadow-sm rounded-5 w-100">
            <div className="sub-container col-md-6 d-none d-md-flex align-items-center justify-content-center p-5">
              <div className="bg-container text-white p-4">
                <div className="border-icon-container mb-4">
                  <i className="bi bi-arrow-right"></i>
                </div>
                <p className="mt-5 sub-title">Hi, Welcome!!</p>
                <h1 className="title">Let's Get Started</h1>
                <p className="py-3 sub-title">
                  Sign in to your account to access the platform.
                  <span className="d-block sub-title">
                    We invite you to join us and get a better experience.
                  </span>
                </p>
                <img
                  src={require("../assets/bg-img-removebg-preview.png")}
                  alt="woman with laptop"
                  className="img-logo d-block"
                />
              </div>
            </div>
            <form className="col-md-6 p-5 d-flex flex-column" onSubmit={handleSubmit}>
              <h1 className="login-heading">Login</h1>
              <div className="form-group my-2">
                <label htmlFor="email" className="py-2">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Your Email"
                  value={email}
                />
                {emailError && <div className="text-danger d-flex justify-content-end">{emailError}</div>}
              </div>
              <div className="form-group my-2">
                <label htmlFor="exampleInputPassword1" className="py-2">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  value={password}
                />
                {passwordError && <div className="text-danger d-flex justify-content-end">{passwordError}</div>}
              </div>
              <div className="form-check my-2 d-flex justify-content-between">
                <div className=''>
                  <input 
                    type="checkbox" 
                    className="form-check-input mt-2" 
                    id="check" 
                    checked={isChecked} 
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="check">Remember me</label>
                  {checkError && <div className="text-danger">{checkError}</div>}
                </div>
              </div>
              <button type="submit" className="btn btn-success w-100 btn-lg my-3 rounded-5">
                LOGIN
              </button>
              <div className="text-center">
                <h5>(or)</h5>
                <h5 className="my-3">
                  Don't have an account? 
                  <Link className="nav-link text-white fs-5 d-inline text-decoration-none" to="/empSignup">
                    <span className="text-success px-1">Register</span>
                  </Link> 
                  Here
                </h5>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmpLogin;
