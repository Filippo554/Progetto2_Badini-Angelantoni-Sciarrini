import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from "sequelize";

export class Classe extends Model<
  InferAttributes<Classe>,
  InferCreationAttributes<Classe>
> {
  declare id: CreationOptional<number>;
  declare nome: string;
  declare indirizzo: CreationOptional<string | null>;
  declare anno: number;

  static initModel(sequelize: Sequelize): typeof Classe {
    Classe.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        nome: {
          type: DataTypes.STRING(10),
          allowNull: false,
          set(value: string) {
            this.setDataValue("nome", value?.trim());
          },
          validate: {
            notEmpty: true,
            len: [1, 10],
            is: /^[1-5][A-Z]$/,
          },
        },

        indirizzo: {
          type: DataTypes.STRING(100),
          allowNull: true,
          set(value: string | null) {
            this.setDataValue("indirizzo", value ? value.trim() : null);
          },
        },

        anno: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          validate: {
            isInt: true,
            min: 1,
            max: 5,
          },
        },
      },
      {
        sequelize,
        tableName: "classe",
        timestamps: false,

        indexes: [
          {
            unique: true,
            fields: ["nome"],
          },
        ],
      }
    );

    return Classe;
  }
}