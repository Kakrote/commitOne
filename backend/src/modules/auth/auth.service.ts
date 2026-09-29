import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {findFacultyMembers,findUserByEmail,addFaculty} from "./auth.repository";
import { CreateFacultyInput } from "./auth.types";
import {AppError} from "../../utils/appError";

type FacultyRecord = NonNullable<Awaited<ReturnType<typeof findUserByEmail>>>;
type SafeFacultyRecord = Omit<FacultyRecord, "password">;


// to sanitize the faculty record and remove the password field before sending it to the client;

const sanitizeFacultyRecord = <T extends FacultyRecord | SafeFacultyRecord>(faculty:T):SafeFacultyRecord=>{
    if(!faculty){
        throw new Error("Faculty record is missing");
    }

    const safeFacultyRecord = {...faculty} as SafeFacultyRecord & { password?:unknown};
    delete safeFacultyRecord.password;
    return safeFacultyRecord;
};

export const createFaculty = async (facultyData: CreateFacultyInput)=>{
    const existingFaculty = await findUserByEmail(facultyData.email);
    if(existingFaculty){
        throw new AppError("This email is already registered with us",400);
    }
    const hashedPassword = facultyData.password
        ? await bcrypt.hash(facultyData.password, 12)
        : undefined;
    const newFaculty = await addFaculty({
        ...facultyData,
        password:hashedPassword,
    })
    return sanitizeFacultyRecord(newFaculty);
}

export const loginFaculty = async (facultyRecord:{email:string,password:string})=>{

    const faculty = await findUserByEmail(facultyRecord.email);
    if(!faculty){
        throw new AppError("Invalid credentials",401);
    }
    if(!faculty.canLogin || !faculty.password){
        throw new AppError("This faculty account does not have login access",401);
    }
    const isPassword = await bcrypt.compare(
        facultyRecord.password,
        faculty.password
    )
    if(!isPassword){
        throw new AppError("Invalid credentials",401);
    }

    const jwtSecret = process.env.JWT_SECRET;
    if(!jwtSecret){
        throw new AppError("Authentication is not configured",500);
    }

    const token = jwt.sign(
        {
            id:faculty.id,
            email:faculty.email,
            role:faculty.role,

        },
        jwtSecret,{
            expiresIn:"7d",
        }
    );

    return {
        token,
        user:sanitizeFacultyRecord(faculty)
    };
};

export const listFacultyMembers = () => findFacultyMembers();

