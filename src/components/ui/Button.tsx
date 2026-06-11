import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-pill px-7 py-3.5 text-sm font-medium tracking-wide transition duration-300 ease-silk disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Jedyny mocny akcent marki — terakota.
  primary:
    "bg-terracotta text-cream hover:bg-terracotta-deep hover:-translate-y-0.5 shadow-[0_8px_24px_-12px_rgba(156,95,75,0.6)]",
  outline:
    "border border-ink/15 text-ink hover:border-ink/40 hover:bg-ink/[0.03]",
  ghost: "text-ink hover:text-terracotta",
};

interface ButtonProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Gdy podane → renderuje <Link>; inaczej <button>. */
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
}

export function Button({
  children,
  variant = "primary",
  className = "",
  href,
  type = "button",
  onClick,
  disabled,
  target,
  rel,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <Link
        href={href}
        className={cls}
        target={target}
        rel={rel}
        aria-label={ariaLabel}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={cls}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
