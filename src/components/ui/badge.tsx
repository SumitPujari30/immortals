import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-slate-800 text-slate-100",
    secondary: "bg-slate-700 text-slate-300",
    destructive: "bg-red-500/10 text-red-500 border-red-500/20",
    outline: "text-slate-300 border border-slate-700",
    success: "bg-brand-green/10 text-brand-green border-brand-green/20",
    warning: "bg-brand-orange/10 text-brand-orange border-brand-orange/20",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
