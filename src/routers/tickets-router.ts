import { getTicketsOfUser, getTicketsType, postTicket } from "@/controllers/tickets-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const ticketRouter = Router();

ticketRouter
    .all("/*", authenticateToken)
    .get("/types", getTicketsType)
    .get("/", getTicketsOfUser)
    .post("/", postTicket);

export { ticketRouter };