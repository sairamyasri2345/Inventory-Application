import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./orderList.css";
import axios from "axios";

const Order = ({ filterText, darkMode}) => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusOptions] = useState(["Pending", "Approved", "Not Available"]);
  const rowsPerPage = 8;
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3003/appliedProducts"
      );
      if (response.status === 200) {
        console.log("Fetched products:", response.data);
        setProducts(response.data);
      } else {
        console.error("Error fetching products:", response.data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStatusChange = async (productId, newStatus) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product._id === productId ? { ...product, status: newStatus } : product
      )
    );
  
    try {
      const response = await axios.put(`http://localhost:3003/appliedProducts/${productId}`, { status: newStatus });
      if (response.status === 200) {
        console.log('Status updated successfully:', response.data);
        fetchProducts();
      } else {
        console.error('Error updating status:', response.data.error);
        fetchProducts()
      }
    } catch (error) {
      console.error('Error updating status:', error);
      fetchProducts()
    }
  };

  const filteredData = products.filter(
    (item) =>
      (item.employeeId || "").includes(filterText) ||
      (item.employeeName || "").toLowerCase().includes(filterText.toLowerCase()) ||
      (item.date || "").includes(filterText) ||
      (item.status || "").toLowerCase().includes(filterText.toLowerCase()) ||
      (item.productName || "").toLowerCase().includes(filterText.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startRow, startRow + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`container-fluid ${
      darkMode ? "dark-mode" : ""
    }`}>
       {loading ? (
        <p className="d-flex justify-content-center align-items-center text-success h2 py-5 my-5">Loading...</p>):(
      <div className="row p-5">
        <div className="col-md-12">
          <div className="table-responsive mx-3">
            <table className="table table-hover" border={1}>
              <thead className="table-light">
                <tr>
                  <th className="py-3">S/No</th>
                  <th className="py-3">Employee Id</th>
                  <th className="py-3">Employee Name</th>
                  <th className="py-3">Product</th>
                  <th className="py-3">Quantity</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Status</th>
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
                    <td>
                      {new Date(item.date).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      <select
                        value={item.status}
                        onChange={(e) =>
                          handleStatusChange(item._id, e.target.value)
                        }
                      >
                        {statusOptions.map((status, idx) => (
                          <option key={idx} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-md-12">
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
      </div>
       )}
    </div>
  );
};

export default Order;



