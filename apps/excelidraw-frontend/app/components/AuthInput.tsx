"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        <label className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-background border-2 border-border
            text-foreground placeholder-muted-foreground
            transition-all duration-200 ease-out
            focus:outline-none focus:border-primary focus:shadow-lg focus:shadow-primary/20
            hover:border-border/80
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-destructive focus:border-destructive focus:shadow-destructive/20" : ""}
            ${className || ""}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  },
);

AuthInput.displayName = "AuthInput";