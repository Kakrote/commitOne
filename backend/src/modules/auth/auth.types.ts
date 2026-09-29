export interface CreateFacultyInput {
    name: string;
    email: string;
    employeeId?: string;
    department?: string;
    designation?: string;
    password?: string;
    role?: "FACULTY" | "SUPER_ADMIN";
}