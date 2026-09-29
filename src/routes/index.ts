import {Router,Request,Response} from "express";
import authRouter from "../modules/auth/auth.routes";


const router =Router();

router.get("/",(req:Request,res:Response)=>{
    res.send("Welcome to the API");
})

router.use("/auth",authRouter);

export default router;