import express from "express";
import {
  getTicketsByStatus,
  getTicketsForBi,
} from "../controllers/glpiController.js";


import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/tickets/:status", getTicketsByStatus);
router.get("/bi/tickets", getTicketsForBi);

export default router;