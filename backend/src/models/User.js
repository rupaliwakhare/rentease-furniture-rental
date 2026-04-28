import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    age: Number,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    mobile: String,
    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },
    address: {
      street: String,
      area: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      pincode: String,
    },
  },

  { timestamps: true },
);

export default mongoose.model("User", userSchema);
