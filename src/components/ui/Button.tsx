import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost";

const base =
  "group inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-7 py-3.5 text-sm font-medium tracking-wide transition-[background-color,border-color,color,transform] duration-300 ease-silk active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Jedyny mocny akcent marki: terakota (ciemniejszy odcień = kontrast AA z kremem).
  primary:
    "bg-terracotta-deep text-cream hover:bg-[#84503f] shadow-[0_10px_24px_-14px_rgba(132,80,63,0.7)]",
  outline:
    "border border-ink/20 text-ink hover:border-ink/45 hover:bg-ink/[0.03]",
  ghost: "text-ink hover:text-terracotta-ink",
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
