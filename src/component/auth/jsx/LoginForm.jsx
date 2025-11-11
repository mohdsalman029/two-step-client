import React, { useState } from "react";
import InputField from "../../common/jsx/InputField";
import ForgetPassword from "../../common/jsx/ForgetPassword";
import Button from "../../common/jsx/Button";
import styles from "../../common/style/common.module.css";
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../common/helper/apiCall";

const LoginForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ userId: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    try {
      const response = await apiCall("/api/auth/login", "POST", formData);
      console.log(response);

      if (response.success) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/"); // Redirect to home
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.wrapper}>
        <form onSubmit={handleLogin}>
          <h2>Login</h2>
          {error && <p className={styles.error}>{error}</p>}
          <InputField
            type="text"
            name="userId"
            label="Enter your User ID"
            required
            value={formData.userId}
            onChange={handleChange}
          />
          <InputField
            type="password"
            name="password"
            label="Enter your Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <ForgetPassword />
          <div className={styles.registerLogin}>
            <Button text="Log In" onClick={handleLogin} />
            <Button text="Register" onClick={handleRegister} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
