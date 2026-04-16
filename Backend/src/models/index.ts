import { sequelize } from "../db/database";
import { Utente } from "./Utente";
import { Aula } from "./Aula";
import { Classe } from "./Classe";
import { Prenotazione } from "./Prenotazione";
import { PrenotazioneClasse } from "./PrenotazioneClasse";

let initialized = false;

export function initModels(): void {
  if (initialized) return;

  Utente.initModel(sequelize);
  Aula.initModel(sequelize);
  Classe.initModel(sequelize);
  Prenotazione.initModel(sequelize);
  PrenotazioneClasse.initModel(sequelize);

  Utente.hasMany(Prenotazione, {
    foreignKey: "utente_id",
    as: "prenotazioni",
  });

  Prenotazione.belongsTo(Utente, {
    foreignKey: "utente_id",
    as: "utente",
  });

  Aula.hasMany(Prenotazione, {
    foreignKey: "aula_id",
    as: "prenotazioni",
  });

  Prenotazione.belongsTo(Aula, {
    foreignKey: "aula_id",
    as: "aula",
  });

  Prenotazione.belongsToMany(Classe, {
    through: PrenotazioneClasse,
    foreignKey: "prenotazione_id",
    otherKey: "classe_id",
    as: "classi",
  });

  Classe.belongsToMany(Prenotazione, {
    through: PrenotazioneClasse,
    foreignKey: "classe_id",
    otherKey: "prenotazione_id",
    as: "prenotazioni",
  });

  initialized = true;
}

initModels();

export { sequelize, Utente, Aula, Classe, Prenotazione, PrenotazioneClasse };
