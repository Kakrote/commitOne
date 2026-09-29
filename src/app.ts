import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes";
import {errorHandler} from "./middlewares/error.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello world from express");
})

app.use("/api/auth", authRouter);
app.use(errorHandler);

export default app;