import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();


const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error("Variabili .env mancanti (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)");
}

// creazione connessione Sequelize
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : 5432,
  dialect: "postgres",
  logging: false,
  define: {
    freezeTableName: true,
    timestamps: false,
  },
});