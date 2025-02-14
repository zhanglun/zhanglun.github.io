import { type VariantProps, tv } from "tailwind-variants";
export { default as Badge } from "./Badge.svelte";

export const badgeVariants = tv({
  base: "badge text-[var(--tagBorderColor)] border border-dashed border-[var(--tagBorderColor)] rounded-[3px] p-[2px_5px_2.5px] leading-none",
  variants: {
    variant: {
      default:
        "",
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

export type Variant = VariantProps<typeof badgeVariants>["variant"];
