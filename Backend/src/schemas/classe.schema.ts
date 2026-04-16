import { z } from "zod";

const classeNameRegex = /^[1-5][A-Z]{1,4}$/;

const body = z.object({
  nome: z.string().trim().min(2).max(10).regex(classeNameRegex, "Nome classe non valido"),
  indirizzo: z.string().trim().max(100).optional().nullable(),
  anno: z.coerce.number().int().min(1).max(5),
});

export const createClasseSchema = z.object({ body });
export const updateClasseSchema = z.object({ body: body.partial().refine((data: any) => Object.keys(data).length > 0, { message: "Almeno un campo da aggiornare è obbligatorio" }) });
export const classeIdParamSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }) });
