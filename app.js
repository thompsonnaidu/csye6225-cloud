import express from 'express';
import appRoute from './routes/app.route.js';
import assingmentRoute from "./routes/assignment.route.js";
import databaseConnectionMiddleware from './middlewares/databaseConnectionMiddleware.js';
const app=express();

const PORT= process.env.PORT || 3000;
app.use(express.json());
//check if the database connection is available
app.use(databaseConnectionMiddleware);
app.use("/healthz",appRoute);
app.use("/v1/assignments",assingmentRoute);
app.use("/",(req,res)=>res.status(503).send())
app.listen(PORT,(err)=>{
    if(err){
        console.log("Failed to start the application")
    }else{
        console.log("Application running on port number ",PORT);
    }
})
