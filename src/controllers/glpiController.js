import asyncHandler from "../utils/asyncHandler.js";
import glpiTickets from "../service/glpi_service.js";

export const getTicketsByStatus = asyncHandler(async (req, res) => {
  const { status } = req.params;
  const tickets = await glpiTickets.getTicketsByStatus(status);
  res.status(200).json(tickets);
});

export const getTicketsForBi = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const tickets = await glpiTickets.getTicketsForBi(startDate, endDate);
  res.status(200).json(tickets);
});
