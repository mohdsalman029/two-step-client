import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../style/RegisterForm.module.css";
import commonStyle from "../../common/style/common.module.css";
import InputField from "../../common/jsx/InputField";
import Button from "../../common/jsx/Button";
import { apiCall } from "../../common/helper/apiCall";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    designation: "",
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Retrieve form data from localStorage when the component mounts
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Store form data in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("formData", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    const data = {
      type: "email",
      purpose: "verification",
      userName: formData.name,
      verificationId: formData.email,
    };

    try {
      const response = await apiCall("/api/auth/getOTP", "POST", data);
      setMessage({ text: response.msg, type: "success" });
      console.log(response);

      // Navigate to OTP verification page
      navigate(`/register/otp-verify?id=${formData.email}`);
    } catch (error) {
      setMessage({
        text: error.msg || "Registration failed. Try again!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className={commonStyle.form}>
      <div className={commonStyle.wrapper}>
        <form onSubmit={handleRegister}>
          <h2>Register</h2>

          {message.text && (
            <p
              className={
                message.type === "success" ? styles.successMsg : styles.errorMsg
              }
            >
              {message.text}
            </p>
          )}

          <InputField
            type="text"
            label="Full Name"
            required
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <InputField
            type="text"
            label="Mobile Number"
            required
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
          />
          <InputField
            type="email"
            label="Email Address"
            required
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            type="text"
            label="Designation"
            required
            name="designation"
            value={formData.designation}
            onChange={handleChange}
          />

          <div className={commonStyle.registerLogin}>
            <Button
              text={loading ? "Registering..." : "Register"}
              disabled={loading}
            />
            <Button text="Log In" onClick={handleLogin} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
