import {Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import logger from "../utils/logger";
import {log} from "node:console";

export const authenticate = (req:Request,res:Response,next:NextFunction)=>{
    const authHeader = req.headers.authorization // checks the authorization header
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        logger.warn("No token provided or invalid format");
        return res.status(401).json({message:"Unauthorized: No token provided or invalid format"});
    }

    const token = authHeader.split(" ")[1]; // extracts the token from the header

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string); // verifies the token using thr secret key 
        (req as any).user = decoded; // attaches the decoded user information to the request object.
        next(); // calls the next middleware function in the stack 
    }
    catch {
        return res.status(401).json({
            message:"Unauthorized Invalid token or expired "
        });
    }
};

