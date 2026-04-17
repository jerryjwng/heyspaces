import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill text-[15px] font-semibold tracking-[-0.01em] ring-offset-background transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover hover:-translate-y-px",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border-[1.5px] border-foreground bg-transparent text-foreground hover:bg-neutral",
        secondary: "bg-neutral text-foreground hover:bg-[hsl(var(--border))]",
        ghost: "rounded-md hover:bg-neutral hover:text-foreground",
        link: "text-foreground underline-offset-4 hover:underline rounded-md",
        "ghost-dark": "border-[1.5px] border-white/30 text-white bg-transparent hover:border-white hover:bg-white/10",
        surface: "bg-neutral text-foreground hover:bg-[hsl(var(--border))]",
      },
      size: {
        default: "h-12 px-7 py-3.5",
        sm: "h-9 px-[18px] text-[13px] font-medium",
        lg: "h-14 px-9 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
