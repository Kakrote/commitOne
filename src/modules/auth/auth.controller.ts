import {Request,Response} from "express";
import {loginFaculty,registerFaculty} from "./auth.service";
import {catchAsync} from "../../utils/catchAsync";
import {loginSchema,registerSchema} from "./auth.validation";


// this is the register controller which will handle the registration of new faculty members
export const registerController = catchAsync(
    async(req:Request,res:Response)=>{
        const payload = registerSchema.parse(req.body);
        const newFaculty = await registerFaculty(payload);

        res.status(201).json({
            success:true,
            data:newFaculty
        })
    }
);


// this is the login controller which will handle the login of existing faculty members
export const loginController = catchAsync(
    async(req:Request,res:Response)=>{
        const payload = loginSchema.parse(req.body);
        const data = await loginFaculty(payload);

        res.json({
            success:true,
            data:data
        })
    }
)