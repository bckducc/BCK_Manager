import styled from 'styled-components';
import type { ReactNode } from 'react';
import { theme } from '../../styles/theme';

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};

  h3 {
    margin: 0 0 ${theme.spacing.md} 0;
    color: ${theme.colors.dark};
    font-size: ${theme.fontSize.xl};
  }
`;

const FormGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const FormLabel = styled.label`
  font-weight: ${theme.fontWeight.semibold};
  color: ${theme.colors.dark};
  display: flex;
  gap: 0.25rem;
`;

const RequiredStar = styled.span`
  color: ${theme.colors.danger};
`;

const FormError = styled.span`
  color: ${theme.colors.danger};
  font-size: ${theme.fontSize.sm};
  margin-top: -0.25rem;
`;

const StyledInput = styled.input<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.$error ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.base};
  font-family: inherit;
  transition: border-color ${theme.transition.base};
  background-color: ${theme.colors.white};
  color: ${theme.colors.text};

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  ${(props) =>
    props.$error &&
    `
    &:focus {
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
  `}
`;

const StyledSelect = styled.select<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.$error ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.base};
  font-family: inherit;
  transition: border-color ${theme.transition.base};
  background-color: ${theme.colors.white};
  color: ${theme.colors.text};
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  ${(props) =>
    props.$error &&
    `
    &:focus {
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
  `}
`;

const StyledTextArea = styled.textarea<{ $error?: boolean }>`
  padding: 0.75rem;
  border: 1px solid ${(props) => (props.$error ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.radius.sm};
  font-size: ${theme.fontSize.base};
  font-family: inherit;
  transition: border-color ${theme.transition.base};
  background-color: ${theme.colors.white};
  color: ${theme.colors.text};
  resize: vertical;
  min-height: 100px;

  &::placeholder {
    color: ${theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  }

  ${(props) =>
    props.$error &&
    `
    &:focus {
      box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    }
  `}
`;

interface FormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  title?: string;
}

export const Form = ({ children, onSubmit, title }: FormProps) => {
  return (
    <FormWrapper onSubmit={onSubmit}>
      {title && <h3>{title}</h3>}
      {children}
    </FormWrapper>
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
    <FormGroupWrapper>
      <FormLabel>
        {label}
        {required && <RequiredStar>*</RequiredStar>}
      </FormLabel>
      {children}
      {error && <FormError>{error}</FormError>}
    </FormGroupWrapper>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = ({ error, ...props }: InputProps) => {
  return <StyledInput $error={!!error} {...props} />;
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Array<{ value: string; label: string }>;
  error?: string;
  placeholder?: string;
}

export const Select = ({ options, error, placeholder, ...props }: SelectProps) => {
  return (
    <StyledSelect $error={!!error} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </StyledSelect>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const TextArea = ({ error, ...props }: TextAreaProps) => {
  return <StyledTextArea $error={!!error} {...props} />;
};
