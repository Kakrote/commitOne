import {z} from "zod";

export const createCommitteeSchema = z.object({
    name: z.string().trim().min(2),
    description: z.string().trim().max(2000).optional(),
    chairmanId: z.string().cuid(),
    secretaryId: z.string().cuid(),
}).refine((value) => value.chairmanId !== value.secretaryId, {
    message: "Chairman and secretary must be different faculty members",
    path: ["secretaryId"],
});

export const memberSchema = z.object({
    facultyId: z.string().cuid(),
});

export const createMinuteSchema = z.object({
    title: z.string().trim().min(2),
    meetingDate: z.coerce.date(),
});