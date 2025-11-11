// ForgetPassword.js
import React from "react";
import styles from "../style/common.module.css";

const ForgetPassword = () => {
  return (
    <div className={styles.forget}>
      <label htmlFor="remember">
        <input type="checkbox" id="remember" />
        <p>Remember me</p>
      </label>
      <a href="#">Forgot password?</a>
    </div>
  );
};

export default ForgetPassword;
