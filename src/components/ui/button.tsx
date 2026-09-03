import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-google-blue text-white shadow-soft hover:bg-google-blue-hover hover:shadow-elevated disabled:bg-border disabled:text-foreground-muted disabled:shadow-none",
  secondary:
    "bg-surface text-foreground border border-border hover:bg-surface-hover disabled:opacity-50",
  ghost:
    "text-foreground-muted hover:bg-surface-hover hover:text-foreground disabled:opacity-50",
  outline:
    "border border-google-blue text-google-blue-hover hover:bg-google-blue-tint disabled:opacity-50",
  destructive:
    "bg-google-red text-white hover:brightness-95 disabled:opacity-50",
} as const;

const SIZES = {
  sm: "h-8 px-3.5 text-[13px] gap-1.5",
  md: "h-10 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-[15px] gap-2",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex cursor-pointer items-center justify-center rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:cursor-not-allowed disabled:active:scale-100",
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
