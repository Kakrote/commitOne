import {z} from "zod";

const committeeOfficerSchema = z.object({
    name: z.string().trim().min(3),
    email: z.string().trim().toLowerCase().email(),
    password: z.string().min(8),
    employeeId: z.string().trim().optional(),
    department: z.string().trim().optional(),
    designation: z.string().trim().optional(),
});

export const createCommitteeSchema = z.object({
    name: z.string().trim().min(2),
    description: z.string().trim().max(2000).optional(),
    chairman: committeeOfficerSchema,
    secretary: committeeOfficerSchema,
}).refine((value) => value.chairman.email !== value.secretary.email, {
    message: "Chairman and secretary must use different email addresses",
    path: ["secretary", "email"],
});

export const memberSchema = z.object({
    facultyId: z.string().cuid(),
});

export const createMinuteSchema = z.object({
    title: z.string().trim().min(2),
    meetingDate: z.coerce.date(),
});