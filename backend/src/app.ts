import express from "express";
import cors from "cors";
import router from "./routes/index";
import {errorHandler} from "./middlewares/error.middleware";
import {apiRateLimiter} from "./middlewares/rate-limit.middleware";

const app = express();

const corsOptions = {
    origin:[
        "http://localhost:3002",
        "http://192.168.8.11:3002",
    ],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("hello world from express");
})

app.use("/api",apiRateLimiter,router); // router is like a gateway for the apis 
app.use(errorHandler);

export default app;