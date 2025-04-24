import mongoose  from "mongoose";

const driverSchema = new mongoose.Schema(
    {
    firstName :{
        type:String,
        required:true
    },
    middleName:{
        type:String,       
    },
    lastName:{
        type:String,
        required:true
    },
    contactNumber:{
        type:Number
    },
    emailId:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"Password should be at least of 6 length"]
    },
    address:{
        type:String,
        required:true
    },
    distinct:{
        type:String
    },
    state:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    dlNumber:{
        type:String,
        required:true
    },
    idProof:{
        type:String,
        required:true
    },
    idProofPhoto:{
        type:String,
       
    },
    driverProfilePhoto:{
        type:String,
       
    }
},{timestamps:true}
)


export const Driver = mongoose.model("driver",driverSchema);