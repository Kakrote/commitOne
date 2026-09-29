import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import logger from "../utils/logger";
import {AuthenticatedUser} from "../types/auth";

export const authenticate = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization // checks the authorization header
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        logger.warn("No token provided or invalid format");
        return res.status(401).json({message:"Unauthorized: No token provided or invalid format"});
    }

    const token = authHeader.slice("Bearer ".length).trim();
    if(!token){
        return res.status(401).json({message:"Unauthorized: No token provided or invalid format"});
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string);
        if (typeof decoded === "string" || typeof decoded.id !== "string") {
            return res.status(401).json({
                message:"Unauthorized: invalid token payload"
            });
        }

        req.user = decoded as AuthenticatedUser;
        next(); // calls the next middleware function in the stack 
    }
    catch {
        return res.status(401).json({
            message:"Unauthorized Invalid token or expired "
        });
    }
};

