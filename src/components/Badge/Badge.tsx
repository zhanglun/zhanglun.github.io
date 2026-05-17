import { type VariantProps, tv } from "tailwind-variants";
import clsx from "clsx";
import React from "react";

export const badgeVariants = tv({
  base: "badge text-[var(--tagBorderColor)] border border-dashed border-[var(--tagBorderColor)] rounded-[3px] p-[2px_5px_2.5px] leading-none text-smallcaps",
  variants: {
    variant: {
      default: "",
      secondary:
        "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive:
        "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  href?: string;
}

export default function Badge({
  className,
  variant = "default",
  href,
  children,
  ...props
}: BadgeProps) {
  const Component = href ? "a" : "span";

  return (
    <Component
      className={clsx(badgeVariants({ variant, className }))}
      href={href}
      {...props}
    >
      {children}
    </Component>
  );
}
