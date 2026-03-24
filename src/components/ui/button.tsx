import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    const variants = {
      default: "bg-brand-orange text-white hover:bg-brand-orange/90 shadow-lg shadow-brand-orange/20",
      destructive: "bg-red-500 text-white hover:bg-red-500/90",
      outline: "border border-slate-700 bg-transparent hover:bg-slate-800 text-white",
      secondary: "bg-slate-800 text-white hover:bg-slate-700",
      ghost: "hover:bg-slate-800 text-slate-300 hover:text-white",
      link: "text-brand-orange underline-offset-4 hover:underline",
    };

    const sizes = {
      default: "h-11 px-6 py-2 rounded-xl",
      sm: "h-9 px-3 rounded-lg text-xs",
      lg: "h-14 px-10 rounded-2xl text-lg",
      icon: "h-11 w-11 rounded-xl",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
