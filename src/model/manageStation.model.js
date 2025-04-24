import mongoose from "mongoose";

const manageStationSchema = new mongoose.Schema({
    stationName:{
        type:String,
        required:true
    },
    contact:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    }
},{timestamps:true})

const manageStation = mongoose.model("manageStation",manageStationSchema);

export default manageStation;