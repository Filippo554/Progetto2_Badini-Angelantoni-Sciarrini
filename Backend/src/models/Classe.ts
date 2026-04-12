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
  declare anno: CreationOptional<number | null>;

  static initModel(sequelize: Sequelize): typeof Classe {
    Classe.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },

        nome: {
          type: DataTypes.STRING(10),
          allowNull: false,
        },

        indirizzo: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },

        anno: {
          type: DataTypes.SMALLINT,
          allowNull: true,
          validate: {
            min: 1,
            max: 5,
          },
        },
      },
      {
        sequelize,
        tableName: "classe",
        timestamps: false,
      }
    );

    return Classe;
  }
}