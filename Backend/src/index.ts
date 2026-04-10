import express from "express";
import auleRoutes from "./routes/aule.routes";
import prenotazioniRoutes from "./routes/prenotazioni.routes";

const app = express();

app.use(express.json());

app.use("/aule", auleRoutes);
app.use("/prenotazioni", prenotazioniRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});