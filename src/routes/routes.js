import express from "express";
import {
  getTicketsByStatus,
  getTicketsForBi,
} from "../controllers/glpiController.js";


const router = express.Router();

router.get("/tickets/:status", getTicketsByStatus);
router.get("/bi/tickets", getTicketsForBi);

export default router;