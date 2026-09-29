export interface AuthenticatedUser {
    id: string;
    email: string;
    role: "FACULTY" | "SUPER_ADMIN";
}

export interface CommitteeAccess {
    id: string;
    chairmanId: string;
    secretaryId: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
            committee?: CommitteeAccess;
        }
    }
}

export {};