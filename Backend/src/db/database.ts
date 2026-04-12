import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST) {
  throw new Error("Variabili .env mancanti (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST)");
}

const port = DB_PORT ? Number(DB_PORT) : 5432;

if (Number.isNaN(port)) {
  throw new Error("DB_PORT non valido");
}

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port,
  dialect: "postgres",
  logging: false,
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

// test connessione
export async function testDatabaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("Database connesso correttamente");
  } catch (err) {
    console.error("Errore connessione database:", err);
    throw err;
  }
}