/**
 * Wstrzyknięcie danych strukturalnych JSON-LD.
 * replace('<') chroni przed wyłamaniem ze <script> (XSS).
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
