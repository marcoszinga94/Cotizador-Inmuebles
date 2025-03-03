import type { ButtonHTMLAttributes, ReactNode } from "react";

interface BotonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  isLoading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

export const Boton = ({
  variant = "primary",
  isLoading = false,
  children,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: BotonProps) => {
  const baseStyles =
    "px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all";
  const widthStyles = fullWidth ? "w-full" : "";

  const variantStyles = {
    primary: "bg-primary text-white hover:bg-rosaOscuro focus:ring-primary",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${
        isLoading || disabled ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Procesando...
        </div>
      ) : (
        children
      )}
    </button>
  );
};
