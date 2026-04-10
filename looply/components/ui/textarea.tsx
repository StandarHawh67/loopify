import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[120px] w-full rounded-[1.5rem] border border-white/10 bg-[#0a1020]/80 px-4 py-3 text-sm text-white placeholder:text-mist/70 focus:border-accent/50",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
