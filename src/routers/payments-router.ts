import { getPaymentInfos, postPayment } from "@/controllers/payments-controller";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const paymentRouter = Router();

paymentRouter
    .all("/*", authenticateToken)
    .get("", getPaymentInfos)
    .post("/process", postPayment);

export { paymentRouter }