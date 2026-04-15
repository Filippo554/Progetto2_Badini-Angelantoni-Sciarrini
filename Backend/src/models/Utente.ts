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
          set(value: string) {
            this.setDataValue("email", value.trim().toLowerCase());
          },
          validate: {
            isEmail: true,
            len: [5, 150],
          },
        },

        nome: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 100],
          },
        },

        cognome: {
          type: DataTypes.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: true,
            len: [2, 100],
          },
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
        indexes: [
          {
            unique: true,
            fields: ["email"],
          },
        ],
      }
    );

    return Utente;
  }
}