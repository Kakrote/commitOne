import {z} from "zod";

export const createFacultySchema = z.object({
    name: z.string().trim().min(3,{message:"Name must be at least 3 characters long"}),
    email: z.string().trim().toLowerCase().email({message:"Please provide a valid email address"}),
    password: z.string().min(8, {message:"Password must be at least 8 characters long"}).optional(),
    employeeId: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional(),
    role: z.enum(["FACULTY", "SUPER_ADMIN"]).default("FACULTY"),
}).refine((value) => value.role === "FACULTY" || Boolean(value.password), {
    message: "A super admin account requires a password",
    path: ["password"],
});

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email({message:"Please provide a valid email address"}),
    password: z.string().min(8, {message:"Password must be at least 8 characters long"})
})