import { Router } from "express";
import { Prenotazione } from "../models/Prenotazione";
import { Aula } from "../models/Aula";
import { Utente } from "../models/Utente";
import { Classe } from "../models/Classe";

const router = Router();


// GET TUTTE LE PRENOTAZIONI
router.get("/", async (req, res) => {
  try {
    const prenotazioni = await Prenotazione.findAll({
      include: [
        { model: Aula, as: "aula" },
        { model: Utente, as: "utente" },
        { model: Classe, as: "classi" },
      ],
      order: [
        ["data", "ASC"],
        ["ora_inizio", "ASC"],
      ],
    });

    res.json(prenotazioni);
  } catch (err) {
    res.status(500).json({
      message: "Errore recupero prenotazioni",
      err,
    });
  }
});

//GET SINGOLA PRENOTAZIONE
router.get("/:id", async (req, res) => {
  try {
    const prenotazione = await Prenotazione.findByPk(req.params.id, {
      include: [
        { model: Aula, as: "aula" },
        { model: Utente, as: "utente" },
        { model: Classe, as: "classi" },
      ],
    });

    if (!prenotazione) {
      return res.status(404).json({
        message: "Prenotazione non trovata",
      });
    }

    res.json(prenotazione);
  } catch (err) {
    res.status(500).json({
      message: "Errore server",
      err,
    });
  }
});


// CREATE PRENOTAZIONE
router.post("/", async (req, res) => {
  try {
    const {
      utente_id,
      aula_id,
      data,
      ora_inizio,
      ora_fine,
      note,
      classi,
    } = req.body;

    // VALIDAZIONE BASE
    if (!aula_id || !data || !ora_inizio || !ora_fine) {
      return res.status(400).json({
        message: "Dati mancanti",
      });
    }

    if (ora_fine <= ora_inizio) {
      return res.status(400).json({
        message: "ora_fine deve essere successiva a ora_inizio",
      });
    }

    // CONTROLLO AULA ESISTE
    const aula = await Aula.findByPk(aula_id);
    if (!aula) {
      return res.status(404).json({
        message: "Aula non trovata",
      });
    }

    // CONTROLLO CONFLITTI ORARI
    const prenotazioniEsistenti = await Prenotazione.findAll({
      where: { aula_id, data },
    });

    const conflitto = prenotazioniEsistenti.some((p) => {
      return !(ora_fine <= p.ora_inizio || ora_inizio >= p.ora_fine);
    });

    if (conflitto) {
      return res.status(409).json({
        message: "Conflitto orario: aula già prenotata",
      });
    }

    // CREAZIONE PRENOTAZIONE
    const nuovaPrenotazione = await Prenotazione.create({
      utente_id: utente_id || null,
      aula_id,
      data,
      ora_inizio,
      ora_fine,
      note: note || null,
    });

    // ASSOCIAZIONE CLASSI
    if (classi && Array.isArray(classi)) {
      await (nuovaPrenotazione as any).setClassi(classi);
    }

    const risultato = await Prenotazione.findByPk(nuovaPrenotazione.id, {
      include: [
        { model: Aula, as: "aula" },
        { model: Utente, as: "utente" },
        { model: Classe, as: "classi" },
      ],
    });

    res.status(201).json(risultato);
  } catch (err) {
    res.status(500).json({
      message: "Errore creazione prenotazione",
      err,
    });
  }
});


//DELETE PRENOTAZIONE
router.delete("/:id", async (req, res) => {
  try {
    const prenotazione = await Prenotazione.findByPk(req.params.id);

    if (!prenotazione) {
      return res.status(404).json({
        message: "Prenotazione non trovata",
      });
    }

    await prenotazione.destroy();

    res.json({
      message: "Prenotazione eliminata con successo",
    });
  } catch (err) {
    res.status(500).json({
      message: "Errore eliminazione prenotazione",
      err,
    });
  }
});

export default router;