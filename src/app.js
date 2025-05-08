import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { verifyJwt } from "./middleware/auth.middleware.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
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
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(cookieParser());



import manageStation from "./router/manageStation.router.js"
app.use("/api/v2/stations",manageStation);
import driverRouter from "./router/driver.route.js"
app.use("/api/v2/driver",driverRouter);
import CustomerRouter from "./router/customer.route.js"
app.use("/api/v2/customers",CustomerRouter);
import userRouter from "./router/user.route.js"
app.use("/api/v2/users",userRouter)
import vehicleRouter from "./router/vehicle.router.js"
app.use("/api/v2/vehicles",vehicleRouter)
import customerQuotation from "./router/customerQuotation.router.js"
app.use("/api/v2/quotation",customerQuotation);
import contactRouter from "./router/contact.router.js"
app.use("/api/v2/contact",contactRouter);
import expenseRouter from "./router/expense.router.js"
app.use("/api/v2/expenses",expenseRouter);


import bookingRouter from "./router/booking.router.js"
app.use("/api/v2/bookings",bookingRouter);


import deliveryRouter from "./router/delivery.router.js"
app.use("/api/v2/delivery",deliveryRouter);


import trackerRouter from "./router/tracker.router.js"
app.use("/api/v2/tracking",trackerRouter);


import customerLedgerRouter from "./router/customerLedgerHistory.router.js"
app.use("/api/v2/ledger",customerLedgerRouter);

import statesAndCitiesRouter from "./router/stateAndCity.router.js";
app.use("/api/v2/state",statesAndCitiesRouter);

export {app}