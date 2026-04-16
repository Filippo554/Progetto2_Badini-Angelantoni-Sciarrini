import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  Sequelize,
  BelongsToManySetAssociationsMixin,
  BelongsToManyGetAssociationsMixin,
  BelongsToManyAddAssociationsMixin,
} from "sequelize";

import type { Utente } from "./Utente";
import type { Aula } from "./Aula";
import type { Classe } from "./Classe";

export class Prenotazione extends Model<
  InferAttributes<Prenotazione>,
  InferCreationAttributes<Prenotazione>
> {
  declare id: CreationOptional<number>;

  declare utente_id: number | null;
  declare aula_id: number;

  declare data: string;
  declare ora_inizio: string;
  declare ora_fine: string;

  declare note: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;

  declare utente?: NonAttribute<Utente>;
  declare aula?: NonAttribute<Aula>;
  declare classi?: NonAttribute<Classe[]>;

  declare setClassi: BelongsToManySetAssociationsMixin<Classe, number>;
  declare getClassi: BelongsToManyGetAssociationsMixin<Classe>;
  declare addClassi: BelongsToManyAddAssociationsMixin<Classe, number>;

  static initModel(sequelize: Sequelize): typeof Prenotazione {
    Prenotazione.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        utente_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: "utente",
            key: "id",
          },
          onDelete: "SET NULL",
        },

        aula_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "aula",
            key: "id",
          },
          onDelete: "RESTRICT",
        },

        data: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },

        ora_inizio: {
          type: DataTypes.TIME,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },

        ora_fine: {
          type: DataTypes.TIME,
          allowNull: false,
          validate: {
            notEmpty: true,

            isAfterStart(this: Prenotazione, value: string) {
              const start = new Date(`1970-01-01T${this.ora_inizio}`);
              const end = new Date(`1970-01-01T${value}`);

              if (end <= start) {
                throw new Error("ora_fine deve essere maggiore di ora_inizio");
              }
            },
          },
        },

        note: {
          type: DataTypes.TEXT,
          allowNull: true,
        },

        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "prenotazione",
        timestamps: false,
      }
    );

    return Prenotazione;
  }
}