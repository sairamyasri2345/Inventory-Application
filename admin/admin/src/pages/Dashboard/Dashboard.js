import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [approvedCounts, setApprovedCounts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/products');
        const result = await response.json();
        if (result && Array.isArray(result.data)) {
          setProducts(result.data);
        } else {
          console.error('Expected an array but got:', result);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchApprovedCounts = async () => {
      try {
        const response = await fetch('http://localhost:3003/appliedProducts');
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

  // Calculate outOfStockCount based on products and approved counts data
  const outOfStockCount = products.reduce((count, product) => {
    const approvedCount = approvedCounts[product.productName] || 0;
    const availableQuantity = product.quantity - approvedCount;
    return availableQuantity <= 0 ? count + 1 : count;
  }, 0);

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="text-white card bg-info mx-2">
              <div className="d-flex p-4 gap-3">
                <i className="bi bi-cart4"></i>
                <div>
                  <h4 className="Typography_Heading_H4">Total Products</h4>
                  <h4 className="Typography_Heading_H4">{products.length}</h4>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-lg-3 col-md-6 col-sm-6 col-12">
            <div className="text-white card bg-danger mx-2">
              <div className="d-flex p-4 gap-3 mx-2">
                <div>
                  <i className="bi bi-cart-x"></i>
                </div>
                <div>
                  <h4 className="Typography_Heading_H4">Out Of Stock</h4>
                  <h4 className="Typography_Heading_H4">{outOfStockCount}</h4>
                </div>
              </div>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
