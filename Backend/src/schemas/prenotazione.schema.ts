import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

const body = z.object({
  aula_id: z.coerce.number().int().positive(),
  data: z.string().regex(dateRegex, "Data non valida"),
  ora_inizio: z.string().regex(timeRegex, "Ora inizio non valida"),
  ora_fine: z.string().regex(timeRegex, "Ora fine non valida"),
  note: z.string().trim().max(1000).optional().nullable(),
  classi: z.array(z.coerce.number().int().positive()).min(1, "Seleziona almeno una classe").optional(),
}).refine((data: any) => data.ora_fine > data.ora_inizio, {
  message: "Ora fine deve essere maggiore di ora inizio",
  path: ["ora_fine"],
});

export const createPrenotazioneSchema = z.object({ body });
export const updatePrenotazioneSchema = z.object({ body: body.partial().refine((data: any) => Object.keys(data).length > 0, { message: "Almeno un campo da aggiornare è obbligatorio" }).refine((data: any) => {
  if (data.ora_inizio && data.ora_fine) return data.ora_fine > data.ora_inizio;
  return true;
}, { message: "Ora fine deve essere maggiore di ora inizio", path: ["ora_fine"] }) });
export const prenotazioneIdParamSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }) });
export const prenotazioniQuerySchema = z.object({
  query: z.object({
    data: z.string().regex(dateRegex).optional(),
    settimana: z.string().regex(dateRegex).optional(),
    aula_id: z.coerce.number().int().positive().optional(),
    classe_id: z.coerce.number().int().positive().optional(),
  }).refine((q: any) => !(q.data && q.settimana), { message: "Usa 'data' oppure 'settimana', non entrambi" }),
});
