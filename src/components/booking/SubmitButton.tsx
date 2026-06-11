"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex items-center justify-center gap-2 rounded-pill bg-terracotta px-8 py-4 text-sm font-medium tracking-wide text-cream shadow-[0_8px_24px_-12px_rgba(156,95,75,0.6)] transition duration-300 ease-silk hover:bg-terracotta-deep disabled:pointer-events-none disabled:opacity-60"
    >
      {pending ? (
        <>
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
          />
          Wysyłanie…
        </>
      ) : (
        "Potwierdź rezerwację"
      )}
    </button>
  );
}
