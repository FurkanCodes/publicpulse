import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[color:var(--outline-soft)] bg-[color:var(--surface-elevated)] px-5 py-2 text-sm font-semibold tracking-tight text-foreground shadow-[0_10px_0_var(--shadow-color)] transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:-translate-y-[2px] hover:shadow-[0_12px_0_var(--shadow-strong)] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  {
    variants: {
      variant: {
        default:
          "border-[1.5px] border-[color:var(--outline-strong)] bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "border-[1.5px] border-[color:var(--outline-strong)] bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-[1.5px] border-[color:var(--outline-strong)] bg-[color:var(--surface-elevated)] text-foreground hover:bg-[var(--highlight)]",
        secondary:
          "border border-transparent bg-[var(--highlight)] text-foreground hover:bg-[var(--highlight-strong)]",
        ghost:
          "border border-transparent bg-transparent hover:bg-[var(--highlight)] hover:text-foreground",
        link: "border border-transparent px-0 py-0 text-primary underline-offset-[6px] hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs uppercase tracking-[0.24em]",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11 rounded-full",
        "icon-sm": "h-9 w-9 rounded-full",
        "icon-lg": "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
