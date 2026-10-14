import { Container } from "@/components/ui/Container";

/** Skeleton podstrony usługi: pokazywany podczas nawigacji/streamingu. */
export default function Loading() {
  return (
    <div className="pt-28 pb-24" aria-busy="true" aria-label="Wczytywanie usługi">
      <Container>
        <div className="h-4 w-32 animate-pulse rounded bg-line" />
        <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="h-3 w-24 animate-pulse rounded bg-line" />
            <div className="mt-5 h-12 w-3/4 animate-pulse rounded bg-line" />
            <div className="mt-6 h-8 w-40 animate-pulse rounded bg-line" />
            <div className="mt-8 space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-line" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-line" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-line" />
            </div>
          </div>
          <div className="h-56 animate-pulse rounded-card bg-line" />
        </div>
      </Container>
    </div>
  );
}
