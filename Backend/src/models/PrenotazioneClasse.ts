import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
  Sequelize,
} from "sequelize";

export class PrenotazioneClasse extends Model<
  InferAttributes<PrenotazioneClasse>,
  InferCreationAttributes<PrenotazioneClasse>
> {
  declare prenotazione_id: ForeignKey<number>;
  declare classe_id: ForeignKey<number>;

  static initModel(sequelize: Sequelize): typeof PrenotazioneClasse {
    PrenotazioneClasse.init(
      {
        prenotazione_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "prenotazione",
            key: "id",
          },
          onDelete: "CASCADE",
        },

        classe_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "classe",
            key: "id",
          },
          onDelete: "CASCADE",
        },
      },
      {
        sequelize,
        tableName: "prenotazione_classe",
        timestamps: false,
      }
    );

    return PrenotazioneClasse;
  }
}