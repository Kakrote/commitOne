import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {findUserByEmail,addFaculty} from "./auth.repository";
import { RegisterInput } from "./auth.types";
import {AppError} from "../../utils/appError";
import { email } from "zod";

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

export const registerFaculty = async (facultyData: RegisterInput)=>{
    const existingFaculty = await findUserByEmail(facultyData.email);
    if(existingFaculty){
        throw new AppError("This email is already registered with us",400);
    }
    const hashedPassword = await bcrypt.hash(facultyData.password,10);
    const newFaculty = await addFaculty({
        ...facultyData,
        password:hashedPassword,
    })
    return sanitizeFacultyRecord(newFaculty);
}

export const loginFaculty = async (facultyRecord:{email:string,password:string})=>{

    const faculty = await findUserByEmail(facultyRecord.email);
    if(!faculty){
        throw new AppError("this mail is not found ",401);
    }
    const isPassword = await bcrypt.compare(
        facultyRecord.password,
        faculty.password
    )
    if(!isPassword){
        throw new AppError("invalid cradentials",401);
    }

    const token = jwt.sign(
        {
            id:faculty.id,
            email:faculty.email,

        },
        process.env.JWT_SECRET!,{
            expiresIn:"7d",
        }
    );

    return {
        token,
        user:sanitizeFacultyRecord(faculty)
    };
};

