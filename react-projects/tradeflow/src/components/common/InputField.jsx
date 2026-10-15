import React, { useState } from "react";

/**
 * Reusable InputField Component
 * Features:
 * - Label with optional required asterisk
 * - Password visibility toggle for type="password"
 * - Left icon support
 * - Inline validation error notification displayed directly underneath in red (Matching Image 1)
 * - Supports text, email, password, number, tel, select, and textarea
 */
export default function InputField({
    label,
    id,
    name,
    type = "text",
    value = "",
    onChange,
    placeholder = "",
    error = "",
    required = false,
    disabled = false,
    autoComplete,
    icon,
    options = [],
    rows = 3,
    className = "",
    style = {},
    ...rest
}) {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
        <div className={`common-field-group ${error ? "has-field-error" : ""} ${className}`} style={style}>
            {label && (
                <label className="common-field-label" htmlFor={inputId}>
                    {label} {required && <span className="field-required-asterisk">*</span>}
                </label>
            )}

            <div className="common-field-control-wrap">
                {icon && <i className={`${icon} common-field-leading-icon`}></i>}

                {type === "select" ? (
                    <select
                        id={inputId}
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        className={`common-field-input ${error ? "input-has-error" : ""} ${icon ? "has-leading-icon" : ""}`}
                        {...rest}
                    >
                        {options.map((opt, idx) => {
                            const optVal = typeof opt === "object" ? opt.value : opt;
                            const optLabel = typeof opt === "object" ? opt.label : opt;
                            return (
                                <option key={idx} value={optVal}>
                                    {optLabel}
                                </option>
                            );
                        })}
                    </select>
                ) : type === "textarea" ? (
                    <textarea
                        id={inputId}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        rows={rows}
                        className={`common-field-textarea ${error ? "input-has-error" : ""}`}
                        {...rest}
                    />
                ) : (
                    <input
                        id={inputId}
                        name={name}
                        type={actualType}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className={`common-field-input ${error ? "input-has-error" : ""} ${icon ? "has-leading-icon" : ""} ${isPassword ? "has-password-toggle" : ""}`}
                        {...rest}
                    />
                )}

                {isPassword && (
                    <button
                        type="button"
                        className="common-field-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        title={showPassword ? "Hide password" : "Show password"}
                        tabIndex={-1}
                    >
                        <i className={`bi bi-eye${showPassword ? "-slash" : ""}`}></i>
                    </button>
                )}
            </div>

            {/* Inline validation error notification underneath (Image 1 design) */}
            {error && (
                <div className="common-field-inline-error">
                    {error}
                </div>
            )}
        </div>
    );
}
