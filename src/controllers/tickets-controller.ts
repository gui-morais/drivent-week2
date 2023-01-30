import { AuthenticatedRequest } from "@/middlewares";
import { createAndReturnTicket, enrollmentByUserID, ticketByEnrollmentID, typesOfTickets } from "@/repositories/ticket-repository";
import { Response } from "express";
import httpStatus from "http-status";

export async function getTicketsType(req: AuthenticatedRequest, res: Response) {
    try{
        return res.status(httpStatus.OK).send(await typesOfTickets());
    } catch(err) {
        console.log(err);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function getTicketsOfUser(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;

    try{
        const enrollment = await enrollmentByUserID(userId);
        if(!enrollment) {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        const ticket =  await ticketByEnrollmentID(enrollment.id);
        if(!ticket) {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        return res.status(httpStatus.OK).send(ticket);
    } catch(err) {
        if(err.name==="Not Found") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        console.log(err);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const ticketTypeId = req.body.ticketTypeId as number;
    if(!ticketTypeId) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    try {
        const enrollment = await enrollmentByUserID(userId);
        if(!enrollment) {
            return res.sendStatus(httpStatus.NOT_FOUND)
        }
        return res.status(httpStatus.CREATED).send(await createAndReturnTicket(ticketTypeId, enrollment.id));
    } catch(err) {
        if(err.name==="Not Found") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        console.log(err);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}