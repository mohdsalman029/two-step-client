import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import "./index.css";
import LoginForm from "./component/auth/jsx/LoginForm";
import RegisterForm from "./component/auth/jsx/RegisterForm";
import OTPInput from "./component/common/jsx/OTPInput";
import HomePage from "./component/auth/jsx/Home";

const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  return (
    <Router>
      <Routes>
        {/* Redirect logged-in users trying to access login to Home */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <LoginForm />}
        />
        <Route path="/register" element={<RegisterForm />} />
        <Route
          path="/register/otp-verify"
          element={<OTPInput label={"Mobile Number"} />}
        />

        {/* Protected Route */}
        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
      </Routes>
    </Router>
  );
};

export default App;
