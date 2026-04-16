import { Classe } from "../models/Classe";

export interface CreateClasseDTO {
  nome: string;
  indirizzo?: string | null;
  anno: number;
}

export interface UpdateClasseDTO {
  nome?: string;
  indirizzo?: string | null;
  anno?: number;
}


export async function getAllClassi() {
  return Classe.findAll({
    order: [
      ["anno", "ASC"],
      ["nome", "ASC"],
    ],
  });
}

export async function getClasseById(id: number) {
  const classe = await Classe.findByPk(id);

  if (!classe) {
    throw new Error("Classe non trovata");
  }

  return classe;
}

export async function createClasse(data: CreateClasseDTO) {
  const nome = data.nome?.trim();
  const indirizzo = typeof data.indirizzo === "string" ? data.indirizzo.trim() : null;
  const anno = Number(data.anno);

  if (!nome) {
    throw new Error("Nome classe non valido");
  }

  if (!Number.isInteger(anno) || anno < 1 || anno > 5) {
    throw new Error("Anno classe non valido (1-5)");
  }

  const exists = await Classe.findOne({
    where: {
      nome,
      anno,
    },
  });

  if (exists) {
    throw new Error("Classe già esistente");
  }

  const payload: Partial<Classe> = {
    nome,
    anno,
  };

  if (indirizzo !== null && indirizzo !== undefined) {
    payload.indirizzo = indirizzo;
  }

  return Classe.create(payload as any);
}


export async function updateClasse(id: number, data: UpdateClasseDTO) {
  const classe = await Classe.findByPk(id);

  if (!classe) {
    throw new Error("Classe non trovata");
  }

  if (data.nome !== undefined) {
    const nome = data.nome.trim();

    if (!nome) {
      throw new Error("Nome non valido");
    }

    classe.nome = nome;
  }

  if (data.indirizzo !== undefined) {
    classe.indirizzo = data.indirizzo ?? null;
  }

  if (data.anno !== undefined) {
    const anno = Number(data.anno);

    if (!Number.isInteger(anno) || anno < 1 || anno > 5) {
      throw new Error("Anno non valido");
    }

    classe.anno = anno;
  }

  await classe.save();

  return classe;
}

export async function deleteClasse(id: number) {
  const classe = await Classe.findByPk(id);

  if (!classe) {
    throw new Error("Classe non trovata");
  }

  await classe.destroy();

  return true;
}