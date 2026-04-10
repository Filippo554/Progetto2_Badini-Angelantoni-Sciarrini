import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.json({ message: "Lista prenotazioni" });
});

router.post("/", (req, res) => {
  res.json({ message: "Prenotazione creata" });
});

router.delete("/:id", (req, res) => {
  res.json({ message: "Prenotazione eliminata" });
});

export default router;