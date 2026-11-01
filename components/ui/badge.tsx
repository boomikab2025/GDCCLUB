import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5",
    "rounded-sm border px-2.5 py-1",
    "text-[10px] font-semibold uppercase tracking-[0.16em]",
    "transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ].join(" "),
  {
    variants: {
      variant: {
        /** Solid gold — high emphasis (status, primary tags) */
        default:
          "border-accent bg-accent text-accent-foreground shadow-[0_0_16px_rgba(212,175,55,0.2)]",
        /** Quiet gold outline — secondary / meta */
        secondary:
          "border-accent/35 bg-black/60 text-muted-foreground hover:border-accent/55 hover:text-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        /** Gold frame on black — main accent chip */
        outline:
          "border-accent/55 bg-black text-accent",
        /** Soft gold wash — genres, categories */
        accent:
          "border-accent/45 bg-gradient-to-b from-accent/15 to-accent/5 text-accent shadow-[inset_0_1px_0_rgba(240,215,140,0.12)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
