import React from "react";
import { Form } from "react-bootstrap";

export const TextField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type,
  required,
  disabled,
  className,
  error,
}) => {
  return (
    <Form.Group className={className}>
      {label && (
        <Form.Label>
          {label} {required && <span className="text-danger">*</span>}
        </Form.Label>
      )}
      <Form.Control
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        {...(type === "textarea" && { as: "textarea" })}
      />
      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
};
export default TextField;
