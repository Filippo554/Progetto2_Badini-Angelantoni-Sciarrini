import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const requiredVars = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST"];

const missing = requiredVars.filter((key) => !env[key]);

if (missing.length > 0) {
  throw new Error(`Variabili .env mancanti: ${missing.join(", ")}`);
}

const port = env.DB_PORT ? parseInt(env.DB_PORT, 10) : 3306;

if (Number.isNaN(port)) {
  throw new Error("DB_PORT non valido");
}

const DB_NAME = env.DB_NAME as string;
const DB_USER = env.DB_USER as string;
const DB_PASSWORD = env.DB_PASSWORD as string;
const DB_HOST = env.DB_HOST as string;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port,
  dialect: "mysql",

  logging: env.NODE_ENV === "development" ? console.log : false,

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
});

export async function testDatabaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Database MySQL connesso correttamente");
  } catch (err) {
    console.error("Errore connessione database:", err);
    throw err;
  }
}