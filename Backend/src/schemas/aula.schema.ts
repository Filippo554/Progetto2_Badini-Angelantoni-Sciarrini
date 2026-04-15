import { z } from "zod";

const body = z.object({
  numero: z.coerce.number().int().min(1).max(119),
  capienza: z.coerce.number().int().min(1).max(500).default(30),
  descrizione: z.string().trim().max(200).optional().nullable(),
  piano: z.coerce.number().int().min(0).max(10).optional().nullable(),
});

export const createAulaSchema = z.object({ body });
export const updateAulaSchema = z.object({ body: body.partial().refine((data: any) => Object.keys(data).length > 0, { message: "Almeno un campo da aggiornare è obbligatorio" }) });
export const aulaIdParamSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }) });
