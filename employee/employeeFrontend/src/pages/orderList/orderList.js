import React, { useState, useEffect } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './orderList.css';
import axios from 'axios';

const Order = ({ filterText, onFilterChange }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const rowsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const employeeId = localStorage.getItem('employeeId');

        if (!employeeId) {
          throw new Error('Employee ID not found in localStorage');
        }

        const response = await axios.get(`http://localhost:3003/appliedProducts?employeeId=${employeeId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setData(response.data);
        } else {
          console.error('Failed to fetch products:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    console.log('Current data state:', data); 
  }, [data]);

  if (!data || !Array.isArray(data)) {
    return <div>Loading...</div>; 
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredData = data.filter((item) =>
    item.employeeId.includes(filterText) ||
    item.employeeName.toLowerCase().includes(filterText.toLowerCase()) ||
    formatDate(item.date).includes(filterText) ||
    item.status.toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startRow, startRow + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-12'>
          <div className='card m-4'>
            <div className='card-body'>
              <div className="table-responsive mx-3 my-4">
                <table className="table table-hover" border={1}>
                  <thead>
                    <tr>
                      <th className='py-3'>S/No</th>
                      <th className='py-3'>Employee Id</th>
                      <th className='py-3'>Employee Name</th>
                      <th className='py-3'>Product</th>
                      <th className='py-3'>Quantity</th>
                      <th className='py-3'>Date</th>
                      <th className='py-3'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item, index) => (
                      <tr key={item._id}>
                        <td>{startRow + index + 1}</td>
                        <td>{item.employeeId}</td>
                        <td>{item.employeeName}</td>
                        <td>{item.productName}</td>
                        <td>{item.quantity}</td>
                        <td>{formatDate(item.date)}</td>
                        <td>{item.status}</td>
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
                  Showing {startRow + 1} to {startRow + currentData.length} of {filteredData.length} entries
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
    </div>
  );
};

export default Order;
