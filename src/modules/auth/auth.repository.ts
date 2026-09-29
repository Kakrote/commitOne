import {prisma} from "../../lib/prisma";
import { RegisterInput } from "./auth.types";

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
            role:true,
            createdAt:true,
            updatedAt:true,
        }
    })
}


export const addFaculty= async(facultyData:RegisterInput)=>{
    return await prisma.facultyMember.create({
        data:{
            name:facultyData.name,
            email:facultyData.email,
            employeeId:facultyData.employeeId,
            department:facultyData.department,
            designation:facultyData.designation,
            password:facultyData.password
        }
    })
}
