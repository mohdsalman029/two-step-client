import React, { useEffect, useState } from "react";
import styles from "../style/HomePage.module.css";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  useEffect(() => {
    // Redirect to login if user is not logged in
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // Clear session and redirect to login
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1
          className={styles.title}
          onClick={() => {
            navigate("/");
          }}
        >
          TwoStepAuth
        </h1>

        <button className={styles.button} onClick={handleLoginLogout}>
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </header>

      <main className={styles.body}>
        <h2 className={styles.welcomeText}>Welcome Home</h2>
      </main>
    </div>
  );
};

export default HomePage;
