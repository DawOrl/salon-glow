/** Przycisk wysyłki; stan `pending` pochodzi z useActionState kreatora. */
export function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="press inline-flex min-h-12 items-center justify-center gap-2 rounded-pill bg-terracotta-deep px-8 text-sm font-medium tracking-wide text-cream shadow-[0_10px_24px_-14px_rgba(132,80,63,0.7)] transition-colors duration-300 ease-silk hover:bg-[#84503f] disabled:pointer-events-none disabled:opacity-70"
    >
      {pending ? (
        <>
          <span
            aria-hidden
            className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
          />
          Wysyłamy…
        </>
      ) : (
        "Potwierdź rezerwację"
      )}
    </button>
  );
}
