import { prisma } from "@/config";

export async function paymentByTicketId(ticketId: number) {
    return prisma.payment.findFirst({
        where: {
            ticketId
        }
    })
}

export async function createPayment(paymentInfos: {
	ticketId: number,
	cardData: {
		issuer: string,
    number: number,
    name: string,
    expirationDate: Date,
    cvv: number
	}
}, price: number) {
    await prisma.payment.create({
        data: {
            ticketId: paymentInfos.ticketId,
            value: price,
            cardIssuer: paymentInfos.cardData.issuer,
            cardLastDigits: paymentInfos.cardData.number.toString().slice(-4)
        }
    })
    await prisma.ticket.update({
        where: {
            id: paymentInfos.ticketId
        },
        data: {
            status: "PAID"
        }
    });
    return await prisma.payment.findFirst({
        where: {
            ticketId: paymentInfos.ticketId,
            value: price,
            cardIssuer: paymentInfos.cardData.issuer,
            cardLastDigits: paymentInfos.cardData.number.toString().slice(-4)
        }
    });
}