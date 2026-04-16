import { z } from "zod";

const prenotazioneBaseSchema = z.object({
  aulaId: z.coerce.number().int().positive("L'aula è obbligatoria"),
  utenteId: z.coerce.number().int().positive("L'utente è obbligatorio").optional(),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La data deve essere nel formato YYYY-MM-DD"),
  oraInizio: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "L'ora di inizio deve essere nel formato HH:mm o HH:mm:ss"),
  oraFine: z
    .string()
    .regex(/^\d{2}:\d{2}(:\d{2})?$/, "L'ora di fine deve essere nel formato HH:mm o HH:mm:ss"),
  note: z
    .string()
    .max(255, "Le note non possono superare 255 caratteri")
    .optional()
    .nullable(),
  classi: z
    .array(z.coerce.number().int().positive())
    .min(1, "Selezionare almeno una classe"),
});

type PrenotazioneCreateRefineInput = {
  aulaId: number;
  utenteId?: number | undefined;
  data: string;
  oraInizio: string;
  oraFine: string;
  note?: string | null | undefined;
  classi: number[];
};

type PrenotazioneUpdateRefineInput = {
  aulaId?: number | undefined;
  utenteId?: number | undefined;
  data?: string | undefined;
  oraInizio?: string | undefined;
  oraFine?: string | undefined;
  note?: string | null | undefined;
  classi?: number[] | undefined;
};

export const createPrenotazioneSchema = prenotazioneBaseSchema.refine(
  (data: PrenotazioneCreateRefineInput) => data.oraInizio < data.oraFine,
  {
    message: "L'orario di inizio deve essere precedente all'orario di fine",
    path: ["oraFine"],
  }
);

const updatePrenotazioneBaseSchema = prenotazioneBaseSchema.partial();

export const updatePrenotazioneSchema = updatePrenotazioneBaseSchema.refine(
  (data: PrenotazioneUpdateRefineInput) => {
    if (data.oraInizio && data.oraFine) {
      return data.oraInizio < data.oraFine;
    }
    return true;
  },
  {
    message: "L'orario di inizio deve essere precedente all'orario di fine",
    path: ["oraFine"],
  }
);

export const prenotazioneIdParamSchema = z.object({
  id: z.coerce.number().int().positive("ID prenotazione non valido"),
});

export const prenotazioniQuerySchema = z.object({
  aulaId: z.coerce.number().int().positive().optional(),
  classeId: z.coerce.number().int().positive().optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  settimana: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});