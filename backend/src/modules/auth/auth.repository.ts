import {prisma} from "../../lib/prisma";
import { CreateFacultyInput } from "./auth.types";

export const findUserByEmail = async (email:string)=>{
    return await prisma.facultyMember.findUnique({
        where:{
           email:email
        },
        select:{
            id:true,
            email:true,
            name:true,
            designation:true,
            department:true,
            password:true,
            canLogin:true,
            role:true,
            createdAt:true,
            updatedAt:true,
        }
    })
}


export const addFaculty= async(facultyData:CreateFacultyInput)=>{
    return await prisma.facultyMember.create({
        data:{
            name:facultyData.name,
            email:facultyData.email,
            employeeId:facultyData.employeeId,
            department:facultyData.department,
            designation:facultyData.designation,
            password:facultyData.password,
            canLogin:Boolean(facultyData.password),
            role:facultyData.role ?? "FACULTY",
        }
    })
}

export const findFacultyMembers = async () => prisma.facultyMember.findMany({
    select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        designation: true,
        department: true,
    },
    orderBy: {name: "asc"},
});
