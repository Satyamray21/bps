import manageStation from "../model/manageStation.model.js";
import {ApiError} from  "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const createManageStation = asyncHandler(async(req,res)=>{
    console.log(req.body);
    const{stationName,contact,emailId,address,state,city,pincode}=req.body
    if ([stationName, contact, emailId, address, state, city, pincode].some((field) => typeof field === 'string' && field.trim() === "")) {
        throw new ApiError(400, "All fields are compulsory");
    }
    
    const existedStation = await manageStation.findOne({
        $or: [{ stationName}, 
            { emailId }]
    })
    if(existedStation)
    {
        throw new ApiError(401,"Please provide unique email and stationName");
    }
    const station = await manageStation.create({
        stationName,
        emailId,
        contact,
        address,
        state,
        city,
        pincode
    })
    const createdStation = await manageStation.findById(station._id);
    if(!createdStation)
    {
        throw new ApiError(402,"Something went wrong,Please try again");
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            201,
            "Station created Successfully",
            createdStation
        )
    )
})
export {createManageStation};