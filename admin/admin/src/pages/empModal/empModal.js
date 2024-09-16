import React from 'react';
import './empModal.css';
 
const EmployeeModal = ({ employee, handleInputChange, handleSave, handleClose, errors }) => (
  <div className="modal" style={{ display: 'block' }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Add Employee</h5>
          <button type="button" className="close" onClick={handleClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <form>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.name && <small className="text-danger">{errors.name}</small>}
            </div>
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={employee.employeeId}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.employeeId && <small className="text-danger">{errors.employeeId}</small>}
            </div>
            <div className="form-group">
  <label>Email</label>
  <input
    type="email"
    name="email"
    value={employee.email}
    onChange={handleInputChange}
    className="form-control"
  />
  {errors.email && <small className="text-danger">{errors.email}</small>}
</div>
<div className="form-group">
  <label>Password</label>
  <input
    type="password"
    name="password"
    value={employee.password}
    onChange={handleInputChange}
    className="form-control"
  />
  {errors.password && <small className="text-danger">{errors.password}</small>}
</div>


            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={employee.phoneNumber}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber}</small>}
            </div>
            <div className="form-group">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={employee.designation}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.designation && <small className="text-danger">{errors.designation}</small>}
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                name="department"
                value={employee.department}
                onChange={handleInputChange}
                className="form-control"
              />
              {errors.department && <small className="text-danger">{errors.department}</small>}
            </div>
           <div className='d-flex justify-content-end gap-2'>
       
            <button type="button" className="btn btn-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="button" className="btn btn-success" onClick={handleSave}>
              Save
            </button>
           </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
 
export default EmployeeModal;