import app from "./src/app";


const PORT = process.env.PORT || 3000;

(async ()=>{
    try{
        app.listen(PORT,()=>{
            console.log(`server is running on port ${PORT}`);
        })
    } catch (error){
        console.error("Error starting server:",error);
    }
})
();
