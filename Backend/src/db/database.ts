import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Variabile mancante: ${key}`);
  return value;
}

function getPort(): number {
  const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;

  if (Number.isNaN(port)) {
    throw new Error("DB_PORT non valido");
  }

  return port;
}

export const sequelize = new Sequelize(
  getEnv("DB_NAME"),
  getEnv("DB_USER"),
  getEnv("DB_PASSWORD"),
  {
    host: getEnv("DB_HOST"),
    port: getPort(),
    dialect: "mysql",

    logging: process.env.NODE_ENV === "development" ? console.log : false,

    define: {
      freezeTableName: true,
      timestamps: false,
    },

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export async function testDatabaseConnection(): Promise<void> {
  await sequelize.authenticate();
  console.log("Database MySQL connesso correttamente");
}