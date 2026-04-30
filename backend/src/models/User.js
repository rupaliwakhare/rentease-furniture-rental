import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type:Number,
    min: 18,},
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
    mobile: {
      type:String,
    match: /^[0-9]{10}$/,
  },

    role: {
      type: String,
      enum: ["user", "admin", "vendor"],
      default: "user",
    },
    addresses: [
      {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        mobile: {
          type: String,
          required: true,
          match: /^[0-9]{10}$/,
        },
        street: String,
        area: String,
        landmark: String,
        city: {
          type: String,
          index: true,
        },
        state: {
          type: String,
          index: true,
        },
        country: {
          type: String,
          default: "India",
        },
        pincode: {
          type: String,
          match: /^[0-9]{6}$/,
        },

        type: {
          type: String,
          enum: ["home", "office"],
          default: "home",
        },

        // 🔥 Furniture rental specific fields
        floor: String,
        hasLift: {
          type: Boolean,
          default: false,
        },

        deliveryInstructions: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
    rentals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rental",
      },
    ],
  },

  { timestamps: true },
);

export default mongoose.model("User", userSchema);
