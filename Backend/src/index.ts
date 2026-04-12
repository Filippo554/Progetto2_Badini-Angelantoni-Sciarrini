import express from "express";
import dotenv from "dotenv";

import auleRoutes from "./routes/aule.routes";
import prenotazioniRoutes from "./routes/prenotazioni.routes";
import classiRoutes from "./routes/classe.routes";
import utentiRoutes from "./routes/utente.routes";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/aule", auleRoutes);
app.use("/api/v1/prenotazioni", prenotazioniRoutes);
app.use("/api/v1/classi", classiRoutes);
app.use("/api/v1/utenti", utentiRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Backend Prenotazione Aule attivo",
  });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);

  res.status(500).json({
    message: "Errore interno del server",
  });
});

const PORT = process.env.PORT || 3000;

// avvio server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});