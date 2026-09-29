import fs from "node:fs";
import path from "node:path";
import {randomUUID} from "node:crypto";
import multer from "multer";
import {AppError} from "../../utils/appError";

export const minutesUploadDirectory = path.resolve(process.cwd(), "uploads", "minutes");
fs.mkdirSync(minutesUploadDirectory, {recursive: true});

const storage = multer.diskStorage({
    destination: minutesUploadDirectory,
    filename: (_req, _file, callback) => callback(null, `${randomUUID()}.pdf`),
});

const pdfOnly = (_req: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
    if (file.mimetype !== "application/pdf") {
        callback(new AppError("Only PDF files are allowed", 400));
        return;
    }

    callback(null, true);
};

export const uploadMinuteFile = multer({
    storage,
    fileFilter: pdfOnly,
    limits: {fileSize: 10 * 1024 * 1024},
}).single("pdf");