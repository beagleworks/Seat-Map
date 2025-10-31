import React from 'react';
import styles from './Input.module.css';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
}) => {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <input
        type="text"
        className={`${styles.input} ${error ? styles.error : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
