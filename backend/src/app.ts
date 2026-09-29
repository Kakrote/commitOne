import express from "express";
import cors from "cors";
import router from "./routes/index";
import {errorHandler} from "./middlewares/error.middleware";
import {apiRateLimiter} from "./middlewares/rate-limit.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello world from express");
})

app.use("/api",apiRateLimiter,router); // router is like a gateway for the apis 
app.use(errorHandler);

export default app;