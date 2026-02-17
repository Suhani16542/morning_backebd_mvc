const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "subadmin", "employee","admin"],
      default: "user",
    },

    // Verification
    is_email_verified: {
      type: Boolean,
      default: false,
    },

    is_mobile_verified: {
      type: Boolean,
      default: false,
    },

    // =====================
    // PROFILE DETAILS
    // =====================
    profile_image: {
      type: String, // image URL
      default: "",
    },

    banner_image: {
      type: String, // image URL
      default: "",
    },

    bio: {
      type: String,
      maxlength: 300,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "India",
    },

    profile_completion: {
      type: Number,
      default: 0, // %
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
