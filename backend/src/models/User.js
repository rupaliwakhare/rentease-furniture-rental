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
    addresses: [
      {
        fullName: String, // delivery person k liye
        mobile: String, // contact

        street: String, // flat/house no
        area: String, // locality
        landmark: String, // near metro, mall etc

        city: String,
        state: String,
        country: {
          type: String,
          default: "India",
        },
        pincode: String,

        type: {
          type: String,
          enum: ["home", "office"],
          default: "home",
        },

        // 🔥 Furniture rental specific fields
        floor: String, // 3rd floor, 10th floor
        hasLift: {
          type: Boolean,
          default: false,
        },

        deliveryInstructions: String, // "call before coming"

        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },

  { timestamps: true },
);

export default mongoose.model("User", userSchema);
