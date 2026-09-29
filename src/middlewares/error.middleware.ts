import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/appError";
import logger from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
    if (error instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Invalid request data",
            errors: error.issues,
        });
        return;
    }

    if (error instanceof AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }

    logger.error("Unhandled application error", error);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};