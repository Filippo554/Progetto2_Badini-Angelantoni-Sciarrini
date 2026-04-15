import { Aula } from "../models/Aula";

export interface CreateAulaDTO {
  numero: number;
  capienza?: number;
  descrizione?: string | null;
  piano?: number | null;
}

export interface UpdateAulaDTO {
  numero?: number;
  capienza?: number;
  descrizione?: string | null;
  piano?: number | null;
}

export async function getAllAule() {
  return Aula.findAll({
    order: [["numero", "ASC"]],
  });
}

export async function getAulaById(id: number) {
  const aula = await Aula.findByPk(id);
  if (!aula) throw new Error("Aula non trovata");
  return aula;
}


export async function createAula(data: CreateAulaDTO) {
  const numero = Number(data.numero);

  if (!Number.isInteger(numero) || numero < 1 || numero > 119) {
    throw new Error("Numero aula non valido");
  }

  const exists = await Aula.findOne({ where: { numero } });

  if (exists) {
    throw new Error("Aula già esistente");
  }

  const payload: Partial<Aula> = {
    numero,
    capienza: data.capienza ?? 30,
  };

  if (typeof data.descrizione === "string") {
    payload.descrizione = data.descrizione;
  }

  if (typeof data.piano === "number") {
    payload.piano = data.piano;
  }

  return Aula.create(payload as any);
}

export async function updateAula(id: number, data: UpdateAulaDTO) {
  const aula = await Aula.findByPk(id);

  if (!aula) throw new Error("Aula non trovata");

  if (data.numero !== undefined) {
    const numero = Number(data.numero);

    if (!Number.isInteger(numero) || numero < 1 || numero > 119) {
      throw new Error("Numero aula non valido");
    }

    const exists = await Aula.findOne({ where: { numero } });

    if (exists && exists.id !== id) {
      throw new Error("Numero aula già esistente");
    }

    aula.numero = numero;
  }

  if (data.capienza !== undefined) {
    aula.capienza = data.capienza;
  }

  if (typeof data.descrizione === "string") {
    aula.descrizione = data.descrizione;
  }

  if (typeof data.piano === "number") {
    aula.piano = data.piano;
  }

  await aula.save();

  return aula;
}

export async function deleteAula(id: number) {
  const aula = await Aula.findByPk(id);

  if (!aula) throw new Error("Aula non trovata");

  await aula.destroy();

  return true;
}