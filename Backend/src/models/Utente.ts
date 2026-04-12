import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from "sequelize";

export type RuoloUtente = "studente" | "docente" | "ata" | "admin";

export class Utente extends Model<
  InferAttributes<Utente>,
  InferCreationAttributes<Utente>
> {
  declare id: CreationOptional<number>;
  declare email: string;
  declare nome: string;
  declare cognome: string;
  declare ruolo: CreationOptional<RuoloUtente>;
  declare attivo: CreationOptional<boolean>;

  static initModel(sequelize: Sequelize): typeof Utente {
    Utente.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        email: {
          type: DataTypes.STRING(150),
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },

        nome: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        cognome: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },

        ruolo: {
          type: DataTypes.ENUM("studente", "docente", "ata", "admin"),
          allowNull: false,
          defaultValue: "studente",
        },

        attivo: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: "utente",
        timestamps: false,
      }
    );

    return Utente;
  }
}