import { z } from "zod";

/**
 * Walidacja rezerwacji (współdzielona, ale używana po stronie serwera w Server Action).
 * Wymagamy imienia, terminu oraz telefonu LUB e-maila i zgody.
 */
export const reservationSchema = z
  .object({
    serviceId: z.string().min(1, "Wybierz usługę"),
    staffId: z.string().min(1).default("any"),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Wybierz termin"),
    time: z.string().regex(/^\d{2}:\d{2}$/, "Wybierz godzinę"),
    name: z.string().min(2, "Podaj imię i nazwisko").max(80),
    phone: z.string().max(30).optional().default(""),
    email: z.string().max(120).optional().default(""),
    notes: z.string().max(500, "Maksymalnie 500 znaków").optional().default(""),
    consent: z.boolean(),
  })
  .superRefine((d, ctx) => {
    if (!d.consent) {
      ctx.addIssue({
        code: "custom",
        path: ["consent"],
        message: "Potrzebujemy Twojej zgody, aby potwierdzić wizytę",
      });
    }
    const phoneOk = /^[+0-9 ()\-]{7,}$/.test(d.phone);
    const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email);
    if (!d.phone && !d.email) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message: "Podaj telefon lub e-mail",
      });
    } else {
      if (d.phone && !phoneOk) {
        ctx.addIssue({
          code: "custom",
          path: ["phone"],
          message: "Podaj poprawny numer telefonu",
        });
      }
      if (d.email && !emailOk) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message: "Podaj poprawny adres e-mail",
        });
      }
    }
    // Termin musi być w przyszłości (walidacja serwerowa: klient i tak pokazuje
    // tylko przyszłe sloty, ale Server Action jest osiągalna bezpośrednim POST-em).
    const when = new Date(`${d.date}T${d.time}:00`);
    if (!Number.isNaN(when.getTime()) && when.getTime() <= Date.now()) {
      ctx.addIssue({
        code: "custom",
        path: ["date"],
        message: "Wybierz termin w przyszłości",
      });
    }
  });

export type ReservationInput = z.infer<typeof reservationSchema>;
