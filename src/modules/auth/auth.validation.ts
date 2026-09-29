import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(3,{message:"Name must be at least 3 characters long"}),
    email: z.string().trim().toLowerCase().email({message:"Please provide a valid email address"}),
    password: z.string().min(8, {message:"Password must be at least 8 characters long"}),
    employeeId: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional()
})

export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email({message:"Please provide a valid email address"}),
    password: z.string().min(8, {message:"Password must be at least 8 characters long"})
})