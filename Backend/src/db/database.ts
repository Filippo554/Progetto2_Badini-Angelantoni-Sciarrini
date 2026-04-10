import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_NAME,  DB_USER, DB_PASSWORD, DB_HOST, DB_PORT
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error("Variabili .env mancanti");
}

export const sequelize = new Sequelize(
  DB_NAME, DB_USER, DB_PASSWORD,
  {
    host: DB_HOST,
    port: Number(DB_PORT) || 5432,
    dialect: "postgres",
    logging: false,
  }
);