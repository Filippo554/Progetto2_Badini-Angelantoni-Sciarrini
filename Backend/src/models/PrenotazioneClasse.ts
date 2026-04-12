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
  declare id_prenotazione: ForeignKey<number>;
  declare id_classe: ForeignKey<number>;

  static initModel(sequelize: Sequelize): typeof PrenotazioneClasse {
    PrenotazioneClasse.init(
      {
        id_prenotazione: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          references: {
            model: "prenotazione",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        id_classe: {
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
