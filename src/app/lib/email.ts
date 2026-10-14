import type { ReservationInput } from "@/lib/schema";
import { salon } from "@/lib/salon";

interface ReservationMeta {
  serviceName: string;
  staffName: string;
}

/**
 * Wysyłka e-maila o rezerwacji do salonu.
 * - Z kluczem RESEND_API_KEY → wysyła przez REST API Resend (bez dodatkowej zależności).
 * - Bez klucza (np. demo) → loguje treść na serwerze, żeby flow działał bez sekretów.
 * Klucz jest server-only: nigdy NEXT_PUBLIC_.
 */
export async function sendReservationEmail(
  data: ReservationInput,
  meta: ReservationMeta,
): Promise<void> {
  const subject = `Nowa rezerwacja: ${meta.serviceName}, ${data.date} ${data.time}`;
  const text = [
    `Usługa: ${meta.serviceName}`,
    `Stylista: ${meta.staffName}`,
    `Termin: ${data.date} o ${data.time}`,
    `Imię: ${data.name}`,
    `Telefon: ${data.phone || "-"}`,
    `E-mail: ${data.email || "-"}`,
    `Uwagi: ${data.notes || "-"}`,
  ].join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Fallback bez sekretu (demo): nie logujemy pełnych danych kontaktowych.
    const maskEmail = (e: string) =>
      e ? e.replace(/^(.).*(@.*)$/, "$1***$2") : "-";
    const maskPhone = (p: string) => (p ? p.replace(/.(?=.{2})/g, "*") : "-");
    console.info(
      `[rezerwacja] Brak RESEND_API_KEY: log (dane zamaskowane): ${meta.serviceName} | ${data.date} ${data.time} | ${data.name} | tel ${maskPhone(data.phone)} | ${maskEmail(data.email)}`,
    );
    return;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.RESERVATION_FROM ?? "Glow Studio <onboarding@resend.dev>",
        to: process.env.RESERVATION_TO ?? salon.email,
        subject,
        text,
        reply_to: data.email || undefined,
      }),
    });
    if (!res.ok) {
      console.error("[rezerwacja] Resend error", res.status, await res.text());
    }
  } catch (err) {
    console.error("[rezerwacja] Wyjątek przy wysyłce e-maila", err);
  }
}
