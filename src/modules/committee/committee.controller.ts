import {Request, Response} from "express";
import fs from "node:fs/promises";
import path from "node:path";
import {catchAsync} from "../../utils/catchAsync";
import {AppError} from "../../utils/appError";
import {createCommitteeSchema, createMinuteSchema, memberSchema} from "./committee.validation";
import {
    addFacultyToCommittee,
    createNewCommittee,
    getCommittee,
    getMeetingMinute,
    listCommittees,
    listMinutes,
    meetingMinuteDownloadUrl,
    removeFacultyFromCommittee,
    uploadMinute,
} from "./committee.service";

const committeeIdFrom = (req: Request): string => req.params.committeeId as string;
const facultyIdFrom = (req: Request): string => req.params.facultyId as string;

export const listCommitteesController = catchAsync(async (_req, res) => {
    res.json({success: true, data: await listCommittees()});
});

export const getCommitteeController = catchAsync(async (req, res) => {
    res.json({success: true, data: await getCommittee(committeeIdFrom(req))});
});

export const createCommitteeController = catchAsync(async (req, res) => {
    const payload = createCommitteeSchema.parse(req.body);
    res.status(201).json({success: true, data: await createNewCommittee(payload)});
});

export const addMemberController = catchAsync(async (req, res) => {
    const {facultyId} = memberSchema.parse(req.body);
    res.status(201).json({
        success: true,
        data: await addFacultyToCommittee(committeeIdFrom(req), facultyId),
    });
});

export const removeMemberController = catchAsync(async (req, res) => {
    await removeFacultyFromCommittee(committeeIdFrom(req), facultyIdFrom(req));
    res.status(204).send();
});

export const listMinutesController = catchAsync(async (req, res) => {
    const committeeId = committeeIdFrom(req);
    const minutes = await listMinutes(committeeId);
    res.json({
        success: true,
        data: minutes.map((minute) => ({
            ...minute,
            pdfUrl: meetingMinuteDownloadUrl(committeeId, minute.id),
        })),
    });
});

export const uploadMinuteController = catchAsync(async (req, res) => {
    if (!req.file) {
        throw new AppError("A PDF file is required", 400);
    }

    try {
        const payload = createMinuteSchema.parse(req.body);
        const minute = await uploadMinute({
            committeeId: committeeIdFrom(req),
            ...payload,
            pdfUrl: path.join("uploads", "minutes", req.file.filename),
        });

        res.status(201).json({
            success: true,
            data: {
                ...minute,
                pdfUrl: meetingMinuteDownloadUrl(committeeIdFrom(req), minute.id),
            },
        });
    } catch (error) {
        await fs.unlink(req.file.path).catch(() => undefined);
        throw error;
    }
});

export const downloadMinuteController = catchAsync(async (req, res) => {
    const minute = await getMeetingMinute(committeeIdFrom(req), req.params.minuteId as string);
    res.sendFile(path.resolve(process.cwd(), minute.pdfUrl));
});