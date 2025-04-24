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
    },
    stationId: {
        type: String,
        unique: true
    }
},{timestamps:true})

manageStationSchema.pre("save", async function (next) {
    if (!this.stationId) {
        const randomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
        const prefix = this.stationName.slice(0, 4).toUpperCase();
        this.stationId = `STN-${prefix}-${randomCode}`;
    }
    next();
});
const manageStation = mongoose.model("manageStation",manageStationSchema);

export default manageStation;