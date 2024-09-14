import React from "react";
import "./sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ darkMode, sidebarCollapsed }) => {
  // const isOnlyIcons = sidebarContent.every((item) => !item.text);

  return (
    <div
      className={`container-fluid bg-green sidebar-card ${
        sidebarCollapsed ? "icons-only" : ""
      }`}
    >
      <div className="row">
        <div className="col-md-12 p-0 m-0">
          <div
            className={`sidebar-card vh-100  ${
              darkMode ? "dark-mode" : "bg-green text-white"
            }`}
          >
            <div className=" py-3  px-3">
              <img
                src="https://atmoslifestyle.com/wp-content/uploads/2023/05/Atmos-Beige-Logo-1-1.png"
                alt="logo"
                className={` ${sidebarCollapsed ? "logo" : "Atmos-logo"}`}
              />
            </div>

            <ul className="list-unstyled d-flex flex-column gap-4 justify-content-center  mt-4">
              <li className=" list-item px-4 mb-2">
                <Link
                  className="navlink text-white text-decoration-none d-flex"
                  to="/layout/dashboard"
                >
                  <i className="bi bi-microsoft icons"></i>
                  <p className=" px-3 pt-1 list-item-text d-lg-block d-none">
                    Dashboard
                  </p>
                </Link>
              </li>
              <li className="px-4 list-item mb-2">
                <Link
                  className="navlink text-white text-decoration-none d-flex"
                  to="/layout/empList"
                >
                <i class="bi bi-people-fill icons"></i>
                  <p className="px-3 pt-1 list-item-text d-lg-block d-none">
                    EmployeeList
                  </p>
                </Link>
              </li>

              <li className="list-item px-4 mb-2">
                <Link
                  className="navlink text-white text-decoration-none d-flex"
                  to="/layout/orders"
                >
                  <i className="bi bi-cart3 icons"></i>
                  <p className="pt-1 px-3 list-item-text d-lg-block d-none">
                    Orders
                  </p>
                </Link>
              </li>
              <li className="list-item px-4 mb-2">
                <Link
                  className="navlink text-white text-decoration-none d-flex"
                  to="/layout/products"
                >
                  <i className="bi bi-bag-check  icons"></i>
                  <p className="px-3 pt-1 list-item-text d-lg-block d-none">
                    Products
                  </p>
                </Link>
              </li>

              <li className="px-4 list-item mb-2">
                <Link
                  className="navlink text-white text-decoration-none d-flex"
                  to="/layout/changepassword"
                >
                  <i className="bi bi-key  icons "></i>
                  <p className="px-3 pt-1 list-item-text d-lg-block d-none">
                    Change Password
                  </p>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
