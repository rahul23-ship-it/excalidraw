"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  appName?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
  ghost: "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-full px-3 text-sm",
  md: "h-10 rounded-full px-4 py-2",
  lg: "h-12 rounded-full px-6 text-base",
};

export const Button = ({
  children,
  className,
  appName,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  style,
  ...props
}: ButtonProps) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented && appName) {
      alert(`Hello from your ${appName} app!`);
    }
  };

  return (
    <button
      type={type}
      className={[
        "inline-flex items-center justify-center gap-2 whitespace-nowrap border text-sm font-semibold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ borderRadius: "9999px", ...style }}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
