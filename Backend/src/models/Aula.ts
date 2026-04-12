import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  Sequelize,
} from "sequelize";

export class Aula extends Model<
  InferAttributes<Aula>,
  InferCreationAttributes<Aula>
> {
  declare id: CreationOptional<number>;
  declare numero: number;
  declare capienza: CreationOptional<number>;
  declare descrizione: CreationOptional<string | null>;
  declare piano: CreationOptional<number | null>;

  static initModel(sequelize: Sequelize): typeof Aula {
    Aula.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },

        numero: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          unique: true,
          validate: {
            min: 1,
            max: 119,
          },
        },

        capienza: {
          type: DataTypes.SMALLINT,
          allowNull: false,
          defaultValue: 30,
        },

        descrizione: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },

        piano: {
          type: DataTypes.SMALLINT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "aula",
        timestamps: false,
      }
    );

    return Aula;
  }
}