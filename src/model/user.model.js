import mongoose  from "mongoose";

const UserSchema = new mongoose.Schema(
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
    emailId:{
        type:String,
        required:true,
        unique:true
    },
    contactNumber:{
        type:Number
    },
    password:{
        type:String,
        required:true,
        minLength:[6,"Password should be atleast of 6 length"]
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
    idProof:{
        type:String,
        required:true,
        unique:true
    },
    idProofPhoto:{
        type:String,
       
    },
    adminProfilePhoto:{
        type:String,
        
    },
    role:{
        type:String,
        enum:['supervisor','admin']
    },
    adminId: {
        type: String,
        unique: true
      },
      isBlacklisted: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true, 
    },
      
},{timestamps:true}
)
UserSchema.pre("save", async function (next) {
    

    if (!this.adminId) {
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        this.adminId = `${this.firstName}_${randomSuffix}`;
    }

    next();
});


export const User = mongoose.model("User",UserSchema);