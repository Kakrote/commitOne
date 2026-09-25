import app from "./src/app";
import dotenv from "dotenv";
import logger from "./src/utils/logger";

dotenv.config();


const PORT = process.env.PORT||3000 ;

(async ()=>{
    try{
        app.listen(PORT,()=>{
            logger.info(`Server is running on port ${PORT}`);
        })
    } catch (error){
        logger.error("Error starting server:", error);
    }
})
();
