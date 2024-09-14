import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout/layout";
import EmpLogin from "./Auth/login/login";
import EmpSignUp from "./Auth/signup/signup";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<EmpLogin />} />
          <Route path="/empSignup" element={<EmpSignUp />} />
          <Route path="/empLogin" element={<EmpLogin />} />

          <Route path="/layout/*" element={<Layout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
