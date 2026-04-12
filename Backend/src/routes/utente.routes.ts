import { Router } from "express";
import { Utente } from "../models/Utente";

const router = Router();

// GET TUTTI GLI UTENTI

router.get("/", async (req, res) => {
  try {
    const utenti = await Utente.findAll({
      order: [["cognome", "ASC"]],
    });

    res.json(utenti);
  } catch (err) {
    res.status(500).json({
      message: "Errore recupero utenti",
      err,
    });
  }
});

// GET UTENTE SINGOLO
router.get("/:email", async (req, res) => {
  try {
    const utente = await Utente.findByPk(req.params.email);

    if (!utente) {
      return res.status(404).json({
        message: "Utente non trovato",
      });
    }

    res.json(utente);
  } catch (err) {
    res.status(500).json({
      message: "Errore server",
      err,
    });
  }
});

// CREATE UTENTE
router.post("/", async (req, res) => {
  try {
    const { email, nome, cognome, ruolo } = req.body;

    if (!email || !nome || !cognome) {
      return res.status(400).json({
        message: "Dati mancanti",
      });
    }

    const esistente = await Utente.findByPk(email);
    if (esistente) {
      return res.status(409).json({
        message: "Utente già esistente",
      });
    }

    const nuovo = await Utente.create({
      email,
      nome,
      cognome,
      ruolo: ruolo || "studente",
    });

    res.status(201).json(nuovo);
  } catch (err) {
    res.status(500).json({
      message: "Errore creazione utente",
      err,
    });
  }
});


// DELETE UTENTE

router.delete("/:email", async (req, res) => {
  try {
    const utente = await Utente.findByPk(req.params.email);

    if (!utente) {
      return res.status(404).json({
        message: "Utente non trovato",
      });
    }

    await utente.destroy();

    res.json({
      message: "Utente eliminato",
    });
  } catch (err) {
    res.status(500).json({
      message: "Errore eliminazione utente",
      err,
    });
  }
});

export default router;