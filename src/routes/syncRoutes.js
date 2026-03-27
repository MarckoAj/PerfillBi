import express from "express";

const router = express.Router();

router.get("/tickets", (req, res) => res.json({ message: "testando" }));

export default router;
