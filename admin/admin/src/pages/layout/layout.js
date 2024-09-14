import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Dashboard from "../Dashboard/Dashboard";
import Order from "../orderList/orderList";
import EmpNavbar from "../navbar/navbar";
import Products from "../product/product";
import EmployeeList from "../employeeList/employeeList";
import "./layout.css";
import ChangePassword from "../changePassword/changePassword";

const Layout = () => {
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState(null);
  const [filterText, setFilterText] = useState("");
  const appContainerRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      appContainerRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((prevCollapsed) => !prevCollapsed);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = window.localStorage.getItem("token");

        const response = await fetch(
          "http://localhost:3001/layout",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({ token }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        console.log("User data fetched:", data);
        setUserData(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };
  const handleFilterChange = (text) => {
    setFilterText(text);
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  return (
    <div
      ref={appContainerRef}
      className={`container-fluid inventory-container ${
        darkMode ? "dark-mode" : ""
      }`}
    >
      <div className="row ">
        <div
          className={`col-md-2 p-0 m-0 sidebar-col ${
            sidebarCollapsed ? "icons-only" : ""
          }`}
        >
          <Sidebar darkMode={darkMode} sidebarCollapsed={sidebarCollapsed} />
        </div>
        <div
          className={`col-md-10 p-0 m-0 ${sidebarCollapsed ? "expanded" : ""}`}
        >
          <EmpNavbar
            toggleFullScreen={toggleFullScreen}
            toggleDarkMode={toggleDarkMode}
            toggleSidebar={toggleSidebar}
            userData={userData}
            sidebarCollapsed={sidebarCollapsed}
            onFilterChange={handleFilterChange}
          />
          <div className="content">
            <Routes>
              <Route path="/" element={<Navigate to="/layout/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    products={products}
                    onDelete={handleDeleteProduct}
                    onEdit={handleEditProduct}
                  />
                }
              />
              <Route
                path="/orders"
                element={<Order filterText={filterText} />}
              />
              <Route
                path="/products"
                element={<Products filterText={filterText} />}
              />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/empList" element={<EmployeeList />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
