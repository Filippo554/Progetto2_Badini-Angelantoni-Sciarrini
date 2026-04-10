import { Router } from "express";
import { aule } from "../data/aule";

const router = Router();

// GET
router.get("/", (req, res) => {
  res.json(aule);
});

// POST
router.post("/", (req, res) => {
  const { nome, capienza } = req.body;

  if (!nome || !capienza) {
    return res.status(400).json({ message: "Dati mancanti" });
  }

  const nuovaAula = {
    id: Date.now(),
    nome,
    capienza: Number(capienza)
  };

  aule.push(nuovaAula);

  res.status(201).json(nuovaAula);
});

// DELETE
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = aule.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "Aula non trovata" });
  }

  aule.splice(index, 1);

  res.json({ message: "Aula eliminata" });
});

export default router;