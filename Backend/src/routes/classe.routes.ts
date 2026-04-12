import { Router } from "express";
import { Classe } from "../models/Classe";

const router = Router();


// GET TUTTE LE CLASSI
router.get("/", async (req, res) => {
  try {
    const classi = await Classe.findAll({
      order: [["anno", "ASC"]],
    });

    res.json(classi);
  } catch (err) {
    res.status(500).json({
      message: "Errore recupero classi",
      err,
    });
  }
});

// GET CLASSE SINGOLA
router.get("/:id", async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id);

    if (!classe) {
      return res.status(404).json({
        message: "Classe non trovata",
      });
    }

    res.json(classe);
  } catch (err) {
    res.status(500).json({
      message: "Errore server",
      err,
    });
  }
});


// CREATE CLASSE
router.post("/", async (req, res) => {
  try {
    const { nome, indirizzo, anno } = req.body;

    // VALIDAZIONE BASE
    if (!nome || !indirizzo || !anno) {
      return res.status(400).json({
        message: "Dati mancanti",
      });
    }

    if (anno < 1 || anno > 5) {
      return res.status(400).json({
        message: "Anno deve essere tra 1 e 5",
      });
    }

    const nuovaClasse = await Classe.create({
      nome,
      indirizzo,
      anno,
    });

    res.status(201).json(nuovaClasse);
  } catch (err) {
    res.status(500).json({
      message: "Errore creazione classe",
      err,
    });
  }
});


// DELETE CLASSE
router.delete("/:id", async (req, res) => {
  try {
    const classe = await Classe.findByPk(req.params.id);

    if (!classe) {
      return res.status(404).json({
        message: "Classe non trovata",
      });
    }

    await classe.destroy();

    res.json({
      message: "Classe eliminata con successo",
    });
  } catch (err) {
    res.status(500).json({
      message: "Errore eliminazione classe",
      err,
    });
  }
});

export default router;