import React, { useState, useEffect } from 'react';
import EmpProduct from './productModal/productModal';
import axios from 'axios';

const EmployeeDashboard = ({ filterText,userData }) => {
  const [show, setShow] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [appliedProducts, setAppliedProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [productNames, setProductNames] = useState([]);
  const [employeeId, setEmployeeId] = useState('');
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [timeError, setTimeError] = useState('');
  
  const TIME_LIMIT = 25 * 60 * 1000;

   useEffect(() => {
    if (userData) {
      setEmployeeId(userData.employeeId); 
    }
  }, [userData]);

  useEffect(() => {
    const fetchAppliedProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3003/appliedProducts/${employeeId}`);

        if (response.status === 200) {
          setAppliedProducts(response.data);
        } else {
          console.error('Error fetching applied products:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching applied products:', error);
      }
    };

    if (userData) {
      fetchAppliedProducts();
    }
  }, [userData]);

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        const response = await axios.get('http://localhost:3001/products');
        console.log('Response data:', response.data); 
        if (response.data && Array.isArray(response.data.data)) {
          setProductNames(response.data.data.map(product => product.productName));
        } else {
          console.error('Expected an array in response.data.data but got:', response.data);
        }
      } catch (error) {
        console.error('Error fetching product names:', error);
      }
    };

    fetchProductNames();
  }, []);

  useEffect(() => {
    if (filterText) {
      const filtered = appliedProducts.filter(product =>
        product.productName?.toLowerCase().includes(filterText.toLowerCase()) ||
        product.employeeId?.toLowerCase().includes(filterText.toLowerCase()) ||
        product.employeeName?.toLowerCase().includes(filterText.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(appliedProducts);
    }
  }, [appliedProducts, filterText]);

  const handleClose = () => {
    setShow(false);
    setEditMode(false);
    setCurrentProduct(null);
  };

  const handleShow = () => setShow(true);

  const handleApplyProduct = async (formData) => {
    try {
      let response;
      if (editMode) {
        response = await axios.put(`http://localhost:3003/updateProduct/${currentProduct._id}`, formData);
        setAppliedProducts(appliedProducts.map(product => product._id === currentProduct._id ? response.data : product));
      } else {
        response = await axios.post('http://localhost:3003/applyProduct', formData);
        setAppliedProducts([...appliedProducts, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('Error applying product:', error);
    }
  };
  const handleEdit = (product) => {
    const timeSinceApplied = new Date() - new Date(product.date);
    if (timeSinceApplied > TIME_LIMIT) {
      setTimeError('You cannot edit this product after 25 minutes of application.');
      return;
    }
  
    setCurrentProduct(product);
    setEditMode(true);
    setShow(true);
    setTimeError(''); // Clear error if applicable
  };
  
  const handleDelete = async (id) => {
    const product = appliedProducts.find(p => p._id === id);
    const timeSinceApplied = new Date() - new Date(product.date);
    if (timeSinceApplied > TIME_LIMIT) {
      setTimeError('You cannot delete this product after 25 minutes of application.');
      return;
    }
  
    try {
      await axios.delete(`http://localhost:3003/deleteProduct/${id}`);
      setAppliedProducts(appliedProducts.filter(product => product._id !== id));
      setTimeError(''); // Clear error if applicable
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const currentData = filteredProducts.slice(startRow, startRow + rowsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className="col-md-12">
          <div className="card m-3">
            <div className="card-body">
            {timeError && <div className="alert alert-danger">{timeError}</div>}
              <div className="d-flex justify-content-end mx-3 my-3">
                <button onClick={handleShow} className="btn btn-success mb-4">
                  <i className="bi bi-plus-lg px-2"></i>
                  Apply Product
                </button>
              </div>
              <div className="table-responsive mx-3 my-3">
                <table className="table table-hover" border={1}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Employee ID</th>
                      <th>Employee Name</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((product, index) => (
                      <tr key={index}>
                        <td>{startRow + index + 1}</td>
                        <td>{product.employeeId}</td>
                        <td>{product.employeeName}</td>
                        <td>{product.productName}</td>
                        <td>{product.quantity}</td>
                        <td>{new Date(product.date).toLocaleDateString('en-GB')}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm mx-1"
                            onClick={() => handleEdit(product)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm mx-1"
                            onClick={() => handleDelete(product._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
         
            </div>
          </div>

        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3 mx-3">
                <span className="Typography_Heading_H5">
                  Showing {startRow + 1} to {startRow + currentData.length} of {filteredProducts.length} entries
                </span>
                <div>
                  <button
                    className="btn btn-outline-secondary me-2"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <i className="bi bi-chevron-left Typography_Heading_H5"></i>
                  </button>
                  <span className="Typography_Heading_H5">
                    {currentPage} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary ms-2"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <i className="bi bi-chevron-right Typography_Heading_H5"></i>
                  </button>
                </div>
              </div>
      <EmpProduct
        show={show}
        handleClose={handleClose}
        handleApplyProduct={handleApplyProduct}
        productNames={productNames}
        employeeId={employeeId}
        editMode={editMode}
        userData={userData} 
        currentProduct={currentProduct}
      />
    </div>
  );
};

export default EmployeeDashboard;