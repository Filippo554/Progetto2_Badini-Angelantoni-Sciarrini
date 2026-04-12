import { Router } from "express";
import { Aula } from "../models/Aula";

const router = Router();

// GET TUTTE LE AULE
router.get("/", async (req, res) => {
  try {
    const aule = await Aula.findAll({
      order: [["numero", "ASC"]],
    });

    res.json(aule);
  } catch (err) {
    res.status(500).json({
      message: "Errore nel recupero delle aule",
      err,
    });
  }
});

// GET AULA SINGOLA
router.get("/:id", async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id);

    if (!aula) {
      return res.status(404).json({
        message: "Aula non trovata",
      });
    }

    res.json(aula);
  } catch (err) {
    res.status(500).json({
      message: "Errore server",
      err,
    });
  }
});

// CREATE AULA
router.post("/", async (req, res) => {
  try {
    const { numero, capienza, descrizione, piano } = req.body;

    // VALIDAZIONE BASE
    if (!numero) {
      return res.status(400).json({
        message: "Numero aula obbligatorio",
      });
    }

    if (numero < 1 || numero > 119) {
      return res.status(400).json({
        message: "Numero aula deve essere tra 1 e 119",
      });
    }

    // CONTROLLO DUPLICATI
    const esistente = await Aula.findOne({
      where: { numero },
    });

    if (esistente) {
      return res.status(409).json({
        message: "Aula già esistente",
      });
    }

    // CREAZIONE
    const nuovaAula = await Aula.create({
      numero,
      capienza: capienza || 30,
      descrizione: descrizione || null,
      piano: piano || null,
    });

    res.status(201).json(nuovaAula);
  } catch (err) {
    res.status(500).json({
      message: "Errore creazione aula",
      err,
    });
  }
});

// DELETE AULA
router.delete("/:id", async (req, res) => {
  try {
    const aula = await Aula.findByPk(req.params.id);

    if (!aula) {
      return res.status(404).json({
        message: "Aula non trovata",
      });
    }

    await aula.destroy();

    res.json({
      message: "Aula eliminata con successo",
    });
  } catch (err) {
    res.status(500).json({
      message: "Errore eliminazione aula",
      err,
    });
  }
});

export default router;