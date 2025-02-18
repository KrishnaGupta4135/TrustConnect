import React from "react";

// Button Component
export const Button = ({
  children,
  type = "button",
  disabled = false,
  variant = "primary",
  className = "",
  onClick,
  ...props
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300",
    outline:
      "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Input Component
export const Input = ({ type = "text", className = "", error, ...props }) => {
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${error ? "border-red-500 focus:ring-red-500 focus:border-red-500" : ""}
        ${className}`}
      {...props}
    />
  );
};

// Alert Component
export const Alert = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-blue-50 text-blue-700 border-blue-200",
    destructive: "bg-red-50 text-red-700 border-red-200",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
    success: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <div className={`p-4 rounded-md border ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Alert Description Component
export const AlertDescription = ({ children, className = "" }) => {
  return <div className={`text-sm mt-1 ${className}`}>{children}</div>;
};

// Dialog Components
export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        onClick={onClose}
      ></div>
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = "" }) => {
  return <div className={`mt-4 ${className}`}>{children}</div>;
};

export const DialogHeader = ({ children, className = "" }) => {
  return <div className={`space-y-2 ${className}`}>{children}</div>;
};

export const DialogTitle = ({ children, className = "" }) => {
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
};
