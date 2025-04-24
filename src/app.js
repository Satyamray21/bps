import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express()
app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json(
    {
        limit:"16kb"
    }
    
))
app.use(express.urlencoded(
    {
        extended:true,
        limit:"16kb"
    }
))
app.use(express.static("public"));
app.use(cookieParser());

import manageStation from "./router/manageStation.router.js"
app.use("/api/v2/stations",manageStation);
import driverRouter from "./router/driver.route.js"
app.use("/api/v2/driver",driverRouter);
import CustomerRouter from "./router/customer.route.js"
app.use("/api/v2/customers",CustomerRouter);
import userRouter from "./router/user.route.js"
app.use("/api/v4/users",userRouter)
import vehicleRouter from "./router/vehicle.router.js"
app.use("/api/v2/vehicles",vehicleRouter)
export {app}