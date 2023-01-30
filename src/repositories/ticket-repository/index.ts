import { prisma } from "@/config";

export function typesOfTickets() {
    return prisma.ticketType.findMany();
}

export async function enrollmentByUserID(userId: number) {
    return prisma.enrollment.findFirst({
        where: {
            userId
        },
        select: {
            id: true
        }
    })
}

export async function ticketByEnrollmentID(enrollmentId: number) {
    return prisma.ticket.findFirst({
        where: {
            enrollmentId
        },
        include: {
            TicketType: true
        }
    })
}

export async function createAndReturnTicket(ticketTypeId: number, enrollmentId: number) {
    await prisma.ticket.create({
        data: {
            status: "RESERVED",
            ticketTypeId,
            enrollmentId
        }
    });
    return await prisma.ticket.findFirst({
        where: {
            enrollmentId,
            ticketTypeId
        },
        include: {
            TicketType: true
        }
    })
}

export async function ticketByID(ticketID: number) {
    return prisma.ticket.findFirst({
        where: {
            id: ticketID
        }
    });
}

export async function ticketTypeById(id: number) {
    return prisma.ticketType.findFirst({
        where: {
            id
        },
        select: {
            price: true
        }
    })
}