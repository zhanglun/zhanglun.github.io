import React, { forwardRef } from 'react';
import { type Variant, badgeVariants } from "./index";
import clsx from "clsx";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement | HTMLAnchorElement> {
  className?: string | null;
  href?: string;
  variant?: Variant;
}

const Badge = forwardRef<
  HTMLSpanElement | HTMLAnchorElement,
  BadgeProps
>(({ className, href, variant = "default", children, ...restProps }, ref) => {
  const isLink = !!href;

  const componentProps = {
    ref,
    className: clsx(badgeVariants({ variant, className })),
    ...restProps
  };

  if (isLink) {
    return (
      <a
        href={href}
        {...componentProps as React.AnchorHTMLAttributes<HTMLAnchorElement>}
      >
        {children}
      </a>
    );
  }

  return (
    <span
      {...componentProps as React.HTMLAttributes<HTMLSpanElement>}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export { Badge };