import React from "react";
import { type Variant, badgeVariants } from "./index";
import clsx from "clsx";

interface Props extends React.HTMLAttributes<HTMLElement> {
  href?: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}

export default function Badge({
  href,
  variant = "default",
  className,
  children,
  ...rest
}: Props) {
  const Component = href ? "a" : "span";

  return (
    <Component
      href={href}
      className={clsx(badgeVariants({ variant, className }))}
      {...rest}
    >
      {children}
    </Component>
  );
}
