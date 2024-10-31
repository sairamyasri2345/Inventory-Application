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
    email: "",
    password: "",
  });

  const [employeeList, setEmployeeList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Items per page

  const validateForm = () => {
    const newErrors = {};

    // Validate name (must be a non-empty string)
    if (!employee.name) newErrors.name = "Name is required.";

    // Validate employeeId (must be a number)
    if (!employee.employeeId) {
      newErrors.employeeId = "Employee ID is required.";
    } else if (isNaN(employee.employeeId)) {
      newErrors.employeeId = "Employee ID must be a number.";
    }

    // Validate phone number (must be numeric and exactly 10 digits)
    if (!employee.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required.";
    } else if (!/^\d{10}$/.test(employee.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits.";
    }

    // Validate email (must be a valid email)
    if (!employee.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(employee.email)) {
      newErrors.email = "Email is not valid.";
    }

    // Validate designation (must be non-empty string)
    if (!employee.designation) {
      newErrors.designation = "Designation is required.";
    } else if (!isNaN(employee.designation)) {
      newErrors.designation = "Designation must be text.";
    }

    // Validate department (must be non-empty string)
    if (!employee.department) {
      newErrors.department = "Department is required.";
    } else if (!isNaN(employee.department)) {
      newErrors.department = "Department must be text.";
    }

    // Validate password (must be non-empty)
    if (!employee.password) newErrors.password = "Password is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get("http://localhost:3001/employeeData");
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
      const response = await axios.post(
        "http://localhost:3001/addEmployees",
        employee
      );
  
      console.log("Employee saved:", response.data);
  
      // If the employee is saved, update the employee list and close the modal
      if (response.data) {
        setEmployeeList((prevList) => [...prevList, response.data]);
      }
      handleCloseModal();
    } catch (error) {
      // Handle validation errors from the backend
      if (error.response && error.response.status === 400) {
        setErrors({ form: error.response.data.message });
      } else if (error.response && error.response.status === 409) {
        // Handle duplicate employee ID or email
        setErrors({ form: "Employee ID or Email already taken." });
      } else {
        console.error("Error saving employee:", error);
        setErrors({ form: "An error occurred while saving the employee." });
      }
    };
    }

    const handleDelete = async (id) => {
      try {
        const response = await axios.delete(`http://localhost:3001/deleteEmployee/${id}`);
        if (response.status === 200) {
          setEmployeeList((prevList) => prevList.filter((emp) => emp._id !== id));
          alert("Employee deleted successfully.");
        }
      } catch (error) {
        console.error(
          "Error deleting employee:",
          error.response ? error.response.data : error.message
        );
        alert(
          `Error deleting employee: ${
            error.response?.data?.message || error.message
          }`
        );
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
      email: "",
      password: "",
      phoneNumber: "",
      designation: "",
      department: "",
    });
  };

  // Pagination handlers
  const totalPages = Math.ceil(employeeList.length / itemsPerPage);

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      prevPage < totalPages ? prevPage + 1 : prevPage
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage));
  };

  // Get current employees for pagination
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employeeList.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee
  );

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
                      <th>Action</th>
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
                          <td>
                            {" "}
                            <button
                              className="btn btn-danger me-2 btn-sm"
                              onClick={() => handleDelete(emp._id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
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
                  Showing {indexOfFirstEmployee + 1} to{" "}
                  {indexOfLastEmployee > employeeList.length
                    ? employeeList.length
                    : indexOfLastEmployee}{" "}
                  of {employeeList.length} entries
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
