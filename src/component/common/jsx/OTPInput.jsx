import React, { useState, useRef, useEffect } from "react";
import styles from "../style/OTPInput.module.css";
import commonStyles from "../style/common.module.css";
import Button from "./Button";
import { apiCall } from "../../common/helper/apiCall"; // Ensure you import this utility
import { useLocation, useNavigate } from "react-router-dom";

const OTPInput = ({ label }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const inputRefs = useRef([]);
  const [formData, setFormData] = useState(null); // For storing formData from localStorage
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve formData from localStorage
  useEffect(() => {
    const savedFormData = localStorage.getItem("formData");
    if (savedFormData) {
      setFormData(JSON.parse(savedFormData));
    }
  }, []);

  // Extract verificationId from URL query parameters
  const getVerificationIdFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("id"); // Get 'id' from URL like http://localhost:5173/register/verify-otp?id=danis
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only digits (0-9)
    if (value.match(/[^0-9]/)) return;

    // Update OTP state
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Auto-focus next input when a value is entered
    if (value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleFocus = (index) => {
    // Set the focus to the respective input
    inputRefs.current[index].focus();
  };

  const handleKeyDown = (e, index) => {
    // Move focus to the previous input if Backspace is pressed
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    if (!formData) {
      setMessage({ text: "Form data is missing!", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    const verificationId = getVerificationIdFromUrl(); // Get verificationId from URL query
    const otpString = otp.join(""); // Convert OTP array to string

    const data = {
      type: "email", // or use the proper verification type if needed
      verificationId, // Extracted from URL query
      otp: otpString, // Joined OTP digits as string
    };

    try {
      const response = await apiCall("/api/auth/verifyOTP", "POST", data);
      setMessage({ text: response.msg, type: "success" });
      console.log(response);

      // If OTP is valid, proceed to registration
      if (response?.isValid) {
        handleRegister(); // Assuming you want to proceed with registration after OTP verification
      }
    } catch (error) {
      setMessage({
        text: error?.msg || "Verification failed. Try again!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!formData) {
      setMessage({ text: "Form data is missing!", type: "error" });
      return;
    }

    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await apiCall("/api/auth/register", "POST", formData);
      setMessage({ text: response.msg, type: "success" });
      console.log(response);

      // Redirect to login page after successful registration
      if (response?.success) navigate("/login");
    } catch (error) {
      setMessage({
        text: error.msg || "Registration failed. Try again!",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={commonStyles.form}>
      <div className={commonStyles.wrapper}>
        <div className={styles.otpWrapper}>
          <div className={styles.label}>Verify {label}</div>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onFocus={() => handleFocus(index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                className={styles.otpInput}
              />
            ))}
          </div>
          <div>
            <Button
              text={loading ? "Verifying..." : "Verify OTP"}
              onClick={handleVerify}
              disabled={loading} // Disable button while loading
            />
          </div>
          {message.text && (
            <div className={`${styles.message} ${styles[message.type]}`}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPInput;
