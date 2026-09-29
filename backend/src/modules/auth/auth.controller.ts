import {Request,Response} from "express";
import {createFaculty,listFacultyMembers,loginFaculty} from "./auth.service";
import {catchAsync} from "../../utils/catchAsync";
import {createFacultySchema,loginSchema} from "./auth.validation";


export const createFacultyController = catchAsync(
    async(req:Request,res:Response)=>{
        const payload = createFacultySchema.parse(req.body);
        const newFaculty = await createFaculty(payload);

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

export const listFacultyController = catchAsync(async (_req: Request, res: Response) => {
    res.json({success: true, data: await listFacultyMembers()});
});