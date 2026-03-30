import type { ReactNode } from 'react';
import styles from '../../styles/forms.module.css';

interface FormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  title?: string;
}

export const Form = ({ children, onSubmit, title }: FormProps) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {title && <h3>{title}</h3>}
      {children}
    </form>
  );
};

interface FormGroupProps {
  label: string;
  children: ReactNode;
  error?: string;
  required?: boolean;
}

export const FormGroup = ({ label, children, error, required }: FormGroupProps) => {
  return (
    <div className={styles.formGroup}>
      <label className={styles.formGroupLabel}>
        {label}
        {required && <span className={styles.formGroupRequired}>*</span>}
      </label>
      {children}
      {error && <span className={styles.formError}>{error}</span>}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ error, ...props }: InputProps) => {
  return (
    <input
      className={`${styles.input} ${error ? styles.inputError : ''}`}
      {...props}
    />
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  error?: string;
  placeholder?: string;
}

export const Select = ({ options, error, placeholder, ...props }: SelectProps) => {
  return (
    <select
      className={`${styles.select} ${error ? styles.selectError : ''}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const TextArea = ({ error, ...props }: TextAreaProps) => {
  return (
    <textarea
      className={`${styles.textarea} ${error ? styles.textareaError : ''}`}
      {...props}
    />
  );
};
