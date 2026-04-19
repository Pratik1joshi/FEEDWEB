'use client';

import clsx from "clsx";

const ToolButton = ({ 
  children, 
  active = false, 
  onClick, 
  title, 
  onMouseEnter,
  onMouseLeave,
  className = "",
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      title={title}
      disabled={disabled}
      className={clsx(
        "p-2.5 rounded-lg transition-all duration-200 ease-in-out border border-transparent",
        "hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:border-blue-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        active 
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105" 
          : "text-gray-600 hover:text-gray-800",
        className
      )}
    >
      {children}
    </button>
  );
};

export default ToolButton;
