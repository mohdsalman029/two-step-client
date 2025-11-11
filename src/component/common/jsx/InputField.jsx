import React from "react";
import styles from "../style/InputField.module.css";

const InputField = ({
  type,
  name,
  label,
  required,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <div className={styles.inputField}>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <label>{label}</label>
    </div>
  );
};

export default InputField;
