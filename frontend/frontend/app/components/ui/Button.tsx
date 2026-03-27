import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

const variantStyles = {
  primary: "bg-white text-black hover:bg-gray-200 border-transparent font-medium",
  secondary: "bg-[#151515] text-white hover:bg-[#1a1a1a] border-[#2a2a2a]",
  ghost: "bg-transparent text-[#a1a1a1] hover:text-white hover:bg-[#151515] border-transparent",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

export function Button({
  children,
  variant = "secondary",
  size = "md",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg border transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#151515]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
