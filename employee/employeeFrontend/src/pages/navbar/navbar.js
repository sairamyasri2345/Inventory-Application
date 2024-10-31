import React, { useState, useEffect } from "react";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

const EmpNavbar = ({
  userData,
  onFilterChange,
  toggleFullScreen,
  toggleDarkMode,
  toggleSidebar,
  sidebarCollapsed,
  darkMode,
}) => {
  const [currentDate, setCurrentDate] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const [filterText, setFilterText] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear localStorage and redirect to login page
    window.localStorage.clear();
    navigate("/empLogin");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${date.getDate()} ${date.toLocaleString("default", {
      month: "long",
    })} ${date.getFullYear()}`;
    setCurrentDate(formattedDate);

    if (userData && userData.employeeName) {
      const name = userData.employeeName.trim();
      const nameParts = name.split(" ");
      let initials = "";

      if (nameParts.length > 1) {
        initials = `${nameParts[0][0]}${nameParts[1][0]}`;
      } else {
        const singleWord = nameParts[0];
        initials = `${singleWord[0]}${singleWord[singleWord.length - 1]}`;
      }

      setUserInitials(initials.toUpperCase());
    }
  }, [userData]);

  const handleSearchInputChange = (e) => {
    const searchText = e.target.value;
    setFilterText(searchText);
    onFilterChange(searchText);
  };

  return (
    <div className={`container-fluid ${darkMode ? "dark-mode" : ""}`}>
      <div className="row">
        <div className="col-md-12 p-0 m-0">
          <nav className="navbar navbar-section px-2 bg-green text-white">
            <div className="container-fluid">
              <input
                type="checkbox"
                id="toggle-sidebar"
                className="toggle-sidebar d-none"
                onChange={toggleSidebar}
                checked={sidebarCollapsed}
              />
              <label htmlFor="toggle-sidebar" id="sidebar-toggle-btn">
                <i
                  className={`bi ${sidebarCollapsed ? "bi-x" : "bi-list"} icons`}
                  title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                ></i>
              </label>
              <div className="input-group w-25">
                <input
                  className="form-control"
                  type="search"
                  placeholder="Search here..."
                  aria-label="Search"
                  value={filterText}
                  onChange={handleSearchInputChange}
                />
                <button
                  className="btn btn-outline-secondary search-btn d-flex justify-content-center align-items-center"
                  type="submit"
                >
                  <i className="bi bi-search" title="Search"></i>
                </button>
              </div>

              <form className="d-flex justify-content-center align-items-center flex-wrap gap-4">
                <div className="d-flex align-items-center text-white calender-btn p-1 rounded-3">
                  <i className="bi bi-calendar" title="Current Date"></i>
                  <span className="px-2">{currentDate}</span>
                </div>

                <i
                  className="bi bi-moon screen-icons mx-2"
                  id="theme-icon"
                  onClick={toggleDarkMode}
                  title="Toggle Dark Mode"
                ></i>

                <i
                  className="bi bi-fullscreen screen-icons mx-2"
                  onClick={toggleFullScreen}
                  title="Toggle Fullscreen"
                ></i>

                <div className="d-flex gap-2 justify-content-center align-items-center position-relative">
                  <div className="user-profile ">
                    <p className="profile-initials mx-1">{userInitials}</p>
                  </div>
                  <ul className="list-unstyled m-0 d-flex flex-column justify-content-center pt-2">
                    <li className="developer text-warning pb-1">Employee</li>
                    <li
                      className="developer h6 dropdown"
                      onClick={toggleDropdown}
                      style={{ cursor: "pointer" }}
                    >
                      {userData?.employeeName || "Employee Name"}
                      <i
                        className={`bi ${
                          dropdownOpen ? "bi-chevron-up" : "bi-chevron-down"
                        } mx-2`}
                        title={dropdownOpen ? "Collapse Menu" : "Expand Menu"}
                      ></i>
                    </li>
                  </ul>
                  {dropdownOpen && (
                    <ul className="dropdown-menu dropdown-menu-end show dropdown-btn position-absolute">
                      <li>
                        <button className="btn" onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              </form>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default EmpNavbar;