import React, { useState, useEffect, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../sidebar/sidebar";
import Dashboard from "../empDashboard/empDashboard";
import Order from "../orderList/orderList";
import EmpNavbar from "../navbar/navbar";
import "./layout.css";
import axios from 'axios';
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
        console.log(token,"token")
        const employeeEmail = window.localStorage.getItem("email");
    
        const response = await axios.post("http://localhost:3001/getEmployeeDetails", { 
          email: employeeEmail 
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
    
        if (response.data.status === "ok") {
          console.log("User data fetched:", response.data.employee);
          setUserData(response.data.employee);
        } else if (response.data.error === "jwt expired") {
          console.error("Token expired. Please log in again.");
          // Handle the expired token: redirect to login, clear localStorage, etc.
          window.localStorage.removeItem("token");
          window.location.href = "/login"; // Redirect to login page
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    
  
    fetchUserData();
  }, []);
  
  

  const handleFilterChange = (text) => {
    setFilterText(text);
  }

  const handleAddProduct = (newProduct) => {
    setProducts([...products, newProduct]);
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter((product) => product.id !== productId));
  };

  const handleEditProduct = (updatedProduct) => {
    setProducts(
      products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
  };

  const handleViewProduct = (productId) => {
    console.log("Viewing product:", productId);
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
                    onDelete={handleDeleteProduct}
                    onEdit={handleEditProduct}
                    onView={handleViewProduct}
                    filterText={filterText}
                    userData={userData}
                  />
                }
              />
              <Route
                path="/orders"
                element={<Order filterText={filterText} />}
              />

              <Route path="/changepassword" element={<ChangePassword />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
