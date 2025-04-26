import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    middleName: {
      type: String,
    },
    lastName: {
      type: String,
      required: true
    },
    emailId: {
      type: String,
      required: true,
      unique: true
    },
    contactNumber: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password should be at least 6 characters long"]
    },
    address: {
      type: String,
      required: true
    },
    distinct: {
      type: String
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    idProof: {
      type: String,
      required: true,
      unique: true
    },
    idProofPhoto: {
      type: String,
      required:true,
    },
    adminProfilePhoto: {
      type: String,
      required:true
    },
    role: {
      type: String,
      enum: ['supervisor', 'admin'],
      required: true
    },
    adminId: {
      type: String,
      unique: true
    },
    isBlacklisted: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Pre-save hook for password hashing and adminId generation
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password before saving
  }

  if (!this.adminId) {
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.adminId = `${this.firstName}_${randomSuffix}`;
  }

  next();
});

export const User = mongoose.model("User", UserSchema);
