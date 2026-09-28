import {z} from "zod";

export const registerSchema = z.object({
    name: z.string().min(3,{message:"Name must be at least 3 characters long"}),
    email: z.string().email({message:"Please provide a valid email address"}),
    password: z.string().min(6, {message:"Password must be at least 6 characters long"}),
    employeeId: z.string().optional(),
    department: z.string().optional(),
    designation: z.string().optional()
})

export const loginSchema = z.object({
    email: z.string().email({message:"Please provide a valid email address"}),
    password: z.string().min(6, {message:"Password must be at least 6 characters long"})
})