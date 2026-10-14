import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="pt-32 pb-28 md:pt-40">
      <Container className="max-w-3xl">
        <p className="font-display text-sm italic text-terracotta-ink">N°404</p>
        <h1 className="mt-4 font-display text-display font-light text-ink">
          Tej strony u&nbsp;nas nie ma
        </h1>
        <p className="mt-5 max-w-lg text-ink-soft">
          Adres mógł się zmienić albo zawierać literówkę. Cennik, metamorfozy
          i rezerwacja są na stronie głównej.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
          <Button href="/">Strona główna</Button>
          <Button href="/uslugi" variant="outline">
            Pełny cennik
          </Button>
        </div>
      </Container>
    </div>
  );
}
