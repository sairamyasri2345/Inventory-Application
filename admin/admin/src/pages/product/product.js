import React, { useState, useEffect } from "react";
import "./product.css";
import ProductModal from "./productModal/productModal";

const Product = ({ onAddProduct, filterText, darkMode }) => {
  const [show, setShow] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [approvedCounts, setApprovedCounts] = useState({});
  const rowsPerPage = 8;

  useEffect(() => {
    // Fetch initial products
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:3001/products"
        );
        const data = await response.json();
        console.log("Fetched Products Data:", data);
        const productsWithDate = data.data.map((product) => ({
          ...product,
          date: new Date().toLocaleDateString(),
        }));
        setProducts(productsWithDate);
        console.log("GET", response.status, data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchApprovedCounts = async () => {
      try {
        const response = await fetch(
          "https://inventory-application-1.onrender.com/appliedProducts"
        );
        const data = await response.json();
        const counts = data.reduce((acc, item) => {
          if (item.status === "Approved") {
            acc[item.productName] =
              (acc[item.productName] || 0) + item.quantity;
          }
          return acc;
        }, {});
        setApprovedCounts(counts);
      } catch (error) {
        console.error("Error fetching approved counts:", error);
      }
    };

    fetchProducts();
    fetchApprovedCounts();
  }, []);

  const handleClose = () => {
    setShow(false);
    setEditIndex(null);
  };

  const handleShow = () => setShow(true);

  const handleSave = async (product) => {
    if (editIndex !== null) {
      // Edit existing product
      const productId = products[editIndex]._id;
      try {
        const response = await fetch(
          `http://localhost:3001/products/${productId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(product),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update product");
        }

        const data = await response.json();
        console.log("Put", response.status, data);

        const updatedProducts = [...products];
        updatedProducts[editIndex] = {
          ...data.data,
          date: new Date().toLocaleDateString(),
        };
        setProducts(updatedProducts);
      } catch (error) {
        console.error("Error updating product:", error);
      }
    } else {
      // Add new product
      try {
        const response = await fetch(
          "http://localhost:3001/products",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...product,
              date: new Date().toLocaleDateString(),
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to save product");
        }

        const data = await response.json();
        console.log("post", response.status, data);

        setProducts([
          ...products,
          {
            ...data.data,
            date: new Date().toLocaleDateString(),
          },
        ]);
      } catch (error) {
        console.error("Error saving product:", error);
      }
    }
    handleClose();
  };

  const handleDelete = async (index) => {
    const productId = products[index]._id;
    const deletedProduct = products[index];
    try {
      const response = await fetch(
        `http://localhost:3001/products/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      console.log("DELETE", response.status, deletedProduct);

      const newProducts = products.filter((_, i) => i !== index);

      setProducts(newProducts);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setShow(true);
  };
  const filteredData = products.filter(
    (item) =>
      (item.employeeId || "").includes(filterText) ||
      (item.employeeName || "")
        .toLowerCase()
        .includes(filterText.toLowerCase()) ||
      (item.date || "").includes(filterText) ||
      (item.status || "").toLowerCase().includes(filterText.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(filterText.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startRow = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startRow, startRow + rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={`container-fluid  ${darkMode ? "dark-mode" : ""}`}>
      <div className="row">
        <div className="col-md-12">
          <div
            className="card m-3 
          "
          >
            <div className="card-body">
              <div className="d-flex justify-content-end">
                <button onClick={handleShow} className="btn btn-success mb-4">
                  <i className="bi bi-plus-lg px-1"></i>
                  Add Product
                </button>
              </div>
              <div className="table-responsive">
                <table className="table  table-hover" border={1}>
                  <thead className="table-light">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Product</th>
                      <th scope="col">Availability</th>
                      <th scope="col">Quantity</th>
                      <th>available Quantity</th>
                      <th scope="col">Date</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((product, index) => {
                      const approvedCount =
                        approvedCounts[product.productName] || 0;
                      const availableQuantity =
                        product.quantity - approvedCount;
                      return (
                        <tr key={index}>
                          <td>{startRow + index + 1}</td>
                          <td>{product.productName}</td>
                          <td>
                            {availableQuantity > 0 ? (
                              <span className="badge bg-success p-2">
                                Available
                              </span>
                            ) : (
                              <span className="badge bg-danger p-2">
                                Not Available
                              </span>
                            )}
                          </td>
                          <td>{product.quantity}</td>
                          <td>{availableQuantity}</td>
                          <td>{product.date}</td>
                          <td>
                            <button
                              className="btn btn-success me-2 btn-sm"
                              onClick={() => handleEdit(index)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-danger me-2 btn-sm"
                              onClick={() => handleDelete(index)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="d-flex justify-content-between align-items-center mt-3 mx-3">
          <span className="Typography_Heading_H5">
            Showing {startRow + 1} to {startRow + currentData.length} of{" "}
            {filteredProducts.length} entries
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

      <ProductModal
        show={show}
        handleClose={handleClose}
        handleSave={handleSave}
        product={editIndex !== null ? products[editIndex] : null}
      />
    </div>
  );
};

export default Product;
