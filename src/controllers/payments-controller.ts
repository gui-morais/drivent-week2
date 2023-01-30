import { AuthenticatedRequest } from "@/middlewares";
import { createPayment, paymentByTicketId } from "@/repositories/payment-repository";
import { enrollmentByUserID, ticketByID, ticketTypeById } from "@/repositories/ticket-repository";
import { Response } from "express";
import httpStatus from "http-status";

export async function getPaymentInfos(req: AuthenticatedRequest, res: Response) {
    const ticketId = Number(req.query.ticketId);
    if(!ticketId || ticketId===NaN) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const { userId } = req;

    try {
        const ticket = await ticketByID(ticketId);
        if(!ticket) {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        const enrollment = await enrollmentByUserID(userId);
        if(!enrollment) {
            return res.sendStatus(httpStatus.NOT_FOUND)
        } 
        if(ticket.enrollmentId!==enrollment.id) {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        return res.status(httpStatus.OK).send(await paymentByTicketId(ticket.id));
    } catch(err) {
        console.log(err);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}

export async function postPayment(req: AuthenticatedRequest, res: Response) {
    const payment = req.body as {
        ticketId: number,
        cardData: {
            issuer: string,
        number: number,
        name: string,
        expirationDate: Date,
        cvv: number
        }
    }

    if(!payment.cardData||!payment.ticketId) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const { userId } = req;

    try {
        const ticket = await ticketByID(payment.ticketId);
        if(!ticket) {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        const enrollment = await enrollmentByUserID(userId);
        if(!enrollment) {
            return res.sendStatus(httpStatus.NOT_FOUND)
        } 
        if(ticket.enrollmentId!==enrollment.id) {
            return res.sendStatus(httpStatus.UNAUTHORIZED);
        }
        const ticketType = await ticketTypeById(ticket.ticketTypeId);
        return res.status(httpStatus.OK).send(await createPayment(payment, ticketType.price));
    } catch(err) {
        console.log(err);
        return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
}