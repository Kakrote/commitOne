import {Router,Request,Response} from "express";
import authRouter from "../modules/auth/auth.routes";
import committeeRouter from "../modules/committee/committee.routes";
import publicCommitteeRouter from "../modules/committee/public.routes";
import {authRateLimiter} from "../middlewares/rate-limit.middleware";


const router =Router();

router.get("/",(req:Request,res:Response)=>{
    res.send("Welcome to the API");
})

router.use("/auth",authRateLimiter,authRouter);
router.use("/public",publicCommitteeRouter);
router.use("/committees",committeeRouter);

export default router;