import React, { useState } from "react";
import axios from "axios";
import "./changePassword.css";

const ChangePassword = (darkMode) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      const response = await axios.put(
        'http://localhost:3001/changePassword',
        { oldPassword, newPassword },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        setMessage("Password changed successfully");
      } else {
        setMessage("Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error.message);
      setMessage("Error changing password");
    }
  };

  return (

    <div className="container-fluid 
    ">
      <div className="row">
        <div className="col-md-12">
        <div className="d-flex justify-content-center align-items-center">
      <div className="change-password-container my-5 px-4 py-4">
        <h2>Change Password</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              className="form-control"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-success mt-3">
            Reset Password
          </button>
        </form>
      </div>
    </div>
        </div>
      </div>
    </div>
  
  );
};

export default ChangePassword;
