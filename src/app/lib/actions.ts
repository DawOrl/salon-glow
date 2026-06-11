"use server";

import { redirect } from "next/navigation";
import { reservationSchema } from "@/lib/schema";
import { getServiceById, getStaffById } from "@/lib/queries";
import { sendReservationEmail } from "./email";

export interface BookingState {
  ok: boolean;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Server Action kreatora rezerwacji. Osiągalna bezpośrednim POST-em, więc
 * waliduje wszystko po stronie serwera (zod) + honeypot przeciw botom.
 */
export async function createReservation(
  _prev: BookingState,
  formData: FormData,
): Promise<BookingState> {
  // Honeypot — ukryte pole wypełniane tylko przez boty.
  if (String(formData.get("website") ?? "").length > 0) {
    return { ok: false, message: "Nie udało się wysłać formularza." };
  }

  const raw = {
    serviceId: String(formData.get("serviceId") ?? ""),
    staffId: String(formData.get("staffId") ?? "any"),
    date: String(formData.get("date") ?? ""),
    time: String(formData.get("time") ?? ""),
    name: String(formData.get("name") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    notes: String(formData.get("notes") ?? "").trim(),
    consent: formData.get("consent") === "on" || formData.get("consent") === "true",
  };

  const parsed = reservationSchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
    }
    return {
      ok: false,
      errors,
      message: "Popraw zaznaczone pola i spróbuj ponownie.",
    };
  }

  const data = parsed.data;
  const service = getServiceById(data.serviceId);
  if (!service) {
    return {
      ok: false,
      errors: { serviceId: "Wybierz usługę" },
      message: "Wybrana usługa jest niedostępna.",
    };
  }
  // Twarda walidacja stylisty — nieznane ID traktujemy jak „pierwszy wolny”.
  const staffValid =
    data.staffId === "any" || Boolean(getStaffById(data.staffId));
  const staffId = staffValid ? data.staffId : "any";
  const staff = staffId !== "any" ? getStaffById(staffId) : undefined;

  // Best-effort: nie blokujemy rezerwacji, jeśli e-mail nie przejdzie.
  await sendReservationEmail(data, {
    serviceName: service.name,
    staffName: staff?.name ?? "Pierwszy wolny stylista",
  });

  const params = new URLSearchParams({
    usluga: service.slug,
    data: data.date,
    godzina: data.time,
    stylista: staffId,
  });
  redirect(`/rezerwacja/dziekujemy?${params.toString()}`);
}
