import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ValidationError, UniqueConstraintError } from "sequelize";

dotenv.config();

// inizializza modelli e associazioni Sequelize
import "./models";

import auleRoutes from "./routes/aule.routes";
import prenotazioniRoutes from "./routes/prenotazioni.routes";
import classiRoutes from "./routes/classe.routes";
import utentiRoutes from "./routes/utente.routes";

const app = express();

// cors globale
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// registrazione routes
app.use("/api/v1/aule", auleRoutes);
app.use("/api/v1/prenotazioni", prenotazioniRoutes);
app.use("/api/v1/classi", classiRoutes);
app.use("/api/v1/utenti", utentiRoutes);

// health check
app.get("/", (_req, res) => {
  res.json({
    status: "OK",
    message: "Backend Prenotazione Aule attivo",
    version: "1.0.0",
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: "Endpoint non trovato",
    code: "NOT_FOUND",
  });
});

// error handler globale
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("[ERROR]", err);

  if (err instanceof ValidationError) {
    res.status(400).json({
      error: "Dati non validi",
      code: "VALIDATION_ERROR",
      details: err.errors.map((e) => ({
        campo: e.path,
        messaggio: e.message,
      })),
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      error: "Risorsa già esistente",
      code: "UNIQUE_CONSTRAINT",
    });
    return;
  }

  res.status(500).json({
    error: "Errore interno del server",
    code: "INTERNAL_ERROR",
  });
});

// avvio server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});