import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-white/10 bg-[#0a1020]/80 px-4 text-sm text-white placeholder:text-mist/70 focus:border-accent/50",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
