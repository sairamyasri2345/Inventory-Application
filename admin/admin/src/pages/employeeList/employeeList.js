import React, { useState, useEffect } from "react";
import axios from "axios";
import EmployeeModal from "../empModal/empModal";
 
const EmployeeList = ({ darkMode }) => {
  const [employee, setEmployee] = useState({
    name: "",
    employeeId: "",
    phoneNumber: "",
    designation: "",
    department: "",
    email:"",
    password:""
  });
 
  const [employeeList, setEmployeeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});
 
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Items per page
 
  const validateForm = () => {
    const newErrors = {};
    if (!employee.name) newErrors.name = "Name is required.";
    if (!employee.employeeId) newErrors.employeeId = "Employee ID is required.";
    if (!employee.phoneNumber) newErrors.phoneNumber = "Phone number is required.";
    else if (employee.phoneNumber.length !== 10) newErrors.phoneNumber = "Phone number must be 10 digits.";
    if (!employee.designation) newErrors.designation = "Designation is required.";
    if (!employee.department) newErrors.department = "Department is required.";
    if (!employee.email) newErrors.email = "Email is required.";
    if (!employee.password) newErrors.password = "Password is required."; 
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  
 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3001/employeeData');
        console.log("Fetched employee data:", response.data); // Log the fetched data
        setEmployeeList(response.data); // Update state
      } catch (error) {
        console.error("Error fetching employee list:", error);
      }
    };
 
    fetchEmployees();
  }, []);
 
  // Input change handler
  const handleInputChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };
 
  // Save employee data
  const handleSave = async () => {
    if (!validateForm()) return; // Validate before saving
 
    try {
      const response = await axios.post("http://localhost:3001/addEmployees", employee);
      console.log("Employee saved:", response.data);
      if (response.data) {
        setEmployeeList((prevList) => [...prevList, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };
 
  // Open modal
  const openModal = () => {
    setShowModal(true);
  };
 
  // Close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEmployee({
      name: "",
      employeeId: "",
      email:"",
      password:"",
      phoneNumber: "",
      designation: "",
      department: "",
    });
  };
 
  // Pagination handlers
  const totalPages = Math.ceil(employeeList.length / itemsPerPage);
 
  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < totalPages ? prevPage + 1 : prevPage));
  };
 
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };
 
  // Get current employees for pagination
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employeeList.slice(indexOfFirstEmployee, indexOfLastEmployee);
 
  return (
    <div className={`container-fluid ${darkMode ? "dark-mode" : ""}`}>
      <div className="row">
        <div className="col-md-12">
          <div className="card m-3">
            <div className="card-body">
              <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-success" onClick={openModal}>
                <i className="bi bi-plus-lg px-1"></i>Add Employee
                </button>
              </div>
 
              {/* Employee List Table */}
              <div className="table-responsive">
                <table className="table table-hover" border={1}>
                  <thead className="table-light">
                    <tr>
                      <th>Name</th>
                      <th>ID</th>
                      <th>Email</th>
                      <th>Password</th>
                      <th>Phone</th>
                      <th>Designation</th>
                      <th>Department</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployees.length > 0 ? (
                      currentEmployees.map((emp, index) => (
                        <tr key={emp.employeeId || index}>
                          <td>{emp.name}</td>
                          <td>{emp.employeeId}</td>
                          <td>{emp.email}</td>
                          <td>{emp.password}</td>
                          <td>{emp.phoneNumber}</td>
                          <td>{emp.designation}</td>
                          <td>{emp.department}</td>
                       
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No employees found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
 
              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mt-3 mx-3">
                <span className="Typography_Heading_H5">
                  Showing {indexOfFirstEmployee + 1} to {indexOfLastEmployee > employeeList.length ? employeeList.length : indexOfLastEmployee} of {employeeList.length} entries
                </span>
                <div>
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left Typography_Heading_H5"></i>
                  </button>
                  <span className="Typography_Heading_H5">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right Typography_Heading_H5"></i>
                  </button>
                </div>
              </div>
 
              {/* Employee Modal */}
              {showModal && (
                <EmployeeModal
                  employee={employee}
                  handleInputChange={handleInputChange}
                  handleSave={handleSave}
                  handleClose={handleCloseModal}
                  errors={errors}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default EmployeeList;