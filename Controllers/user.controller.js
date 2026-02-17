const bcrypt = require("bcryptjs");
const User = require("../Models/user.model");
const OTP = require("../Models/otp.model");
const generateOTP = require("../utils/generateOtp");
const { sendEmail } = require("../services/emailService");
const calculateProfileCompletion = require("../utils/ProfileCompletion");
const {
  generateAccessToken,
  generateRefreshToken
} = require("../utils/token");

/* =====================================================
   SIGNUP
===================================================== */
exports.signup = async (req, res) => {
  try {
    const { username, password, email, mobile, role } = req.body;

    // ---------- Field validation ----------
    const errors = [];
    if (!username) errors.push("Username required");
    if (!email) errors.push("Email required");
    if (!password) errors.push("Password required");
    if (!mobile) errors.push("Mobile required");
    if (!role) errors.push("Role required");

    if (errors.length) {
      return res.status(400).json({ message: "Validation error", errors });
    }

    // ---------- Email validation ----------
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Invalid email format"]
      });
    }

    // ---------- Mobile validation ----------
    const mobilePattern = /^[6-9]\d{9}$/;
    if (!mobilePattern.test(mobile)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Mobile number must start with 6-9 and be 10 digits"]
      });
    }

    // ---------- Role validation ----------
    const validRoles = ["user", "subadmin", "employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Role must be user, subadmin or employee"]
      });
    }

    // ---------- Existing checks ----------
    if (await User.findOne({ email })) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Email already registered"]
      });
    }

    if (await User.findOne({ mobile })) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Mobile already registered"]
      });
    }

    // ---------- Hash password ----------
    // const hashedPassword = await bcrypt.hash(password, 10);

    // ---------- Save user ----------
    const newUser = await User.create({
      username,
      password,
      email,
      mobile,
      role,
      is_email_verified: false,
      is_mobile_verified: false
    });

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        mobile: newUser.mobile,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error("SIGNUP ERROR >>>", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/* =====================================================
   LOGIN
===================================================== */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ---------- Validation ----------
    if (!email || !password) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Email and password required"]
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
        errors: ["Email not registered"]
      });
    }

    // ---------- Password check ----------
    // const isMatch = await bcrypt.compare(password, user.password);
    if (password != user.password) {
      return res.status(401).json({
        message: "Invalid credentials",
        errors: ["Incorrect password"]
      });
    }

    // ---------- Email verification ----------
    if (!user.is_email_verified) {
      return res.status(403).json({
        message: "Validation error",
        errors: ["Email is not verified"]
      });
    }

    // ---------- Tokens ----------
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // ---------- Cookies ----------
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ✅ ✅ ✅ FIX IS HERE
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,   // 🔥 REQUIRED
        name: user.name,           // optional
        email: user.email,         // optional
        role: user.role
      },
      accessToken,
      refreshToken
    });

  } catch (err) {
    console.error("LOGIN ERROR >>>", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const {
      profile_image,
      banner_image,
      bio,
      address,
      city,
      state,
      country,
      pincode
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔹 Update only if value is provided
    user.profile_image = profile_image ?? user.profile_image;
    user.banner_image = banner_image ?? user.banner_image;
    user.bio = bio ?? user.bio;
    user.address = address ?? user.address;
    user.city = city ?? user.city;
    user.state = state ?? user.state;
    user.country = country ?? user.country;
    user.pincode = pincode ?? user.pincode;

    // 🔹 Profile completion calculate
    let completedFields = 0;
    const totalFields = 8;

    if (user.profile_image) completedFields++;
    if (user.banner_image) completedFields++;
    if (user.bio) completedFields++;
    if (user.address) completedFields++;
    if (user.city) completedFields++;
    if (user.state) completedFields++;
    if (user.country) completedFields++;
    if (user.pincode) completedFields++;

    user.profile_completion = Math.round(
      (completedFields / totalFields) * 100
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};





/* =====================================================
   SEND OTP
===================================================== */
exports.sendOTP = async (req, res) => {
  try {
    const { sendBy, otpType } = req.body;

    // ---------- otpType validation ----------
    if (!["email", "mobile"].includes(otpType)) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["otpType must be email or mobile"]
      });
    }

    // ---------- sendBy validation (otpType wise) ----------
    if (!sendBy) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["sendBy is required"]
      });
    }

    if (
      (otpType === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sendBy)) ||
      (otpType === "mobile" && !/^[6-9]\d{9}$/.test(sendBy))
    ) {
      return res.status(400).json({
        message: "Validation error",
        errors: [`Invalid ${otpType}`]
      });
    }

    // ---------- find user ----------
    const user = await User.findOne(
      otpType === "email" ? { email: sendBy } : { mobile: sendBy }
    );

    if (!user) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["User not found"]
      });
    }

    // ---------- Remove old OTP (safe) ----------
    await OTP.deleteMany({ sendBy, otpType });

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.create({
      otpType,
      sendBy,
      otp: hashedOtp,
      expiresAt
    });

    // ---------- Send OTP ----------
    if (otpType === "email") {
      await sendEmail(
        sendBy,
        "Your OTP Code",
        `Your OTP is ${otp}`,
        `<p>Your OTP is <strong>${otp}</strong></p>`
      );
    }

    // (mobile OTP sending future me yahan add kar sakte ho)

    return res.status(200).json({
      message: `OTP sent successfully to ${sendBy}`,
      expiresAt
    });

  } catch (err) {
   console.error("ERROR MESSAGE >>>", err.message);
  console.error("ERROR STACK >>>", err.stack);
  return res.status(500).json({ message: err.message });
  }
};

/* =====================================================
   VERIFY OTP
===================================================== */
exports.verifyOTP = async (req, res) => {
  try {
    const { sendBy, otp } = req.body;

    if (!sendBy || !otp) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["sendBy and otp required"]
      });
    }

    // Get latest OTP record
    const otpRecord = await OTP.findOne({ sendBy }).sort({ createdAt: -1 });
    if (!otpRecord) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Invalid OTP"]
      });
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["OTP expired"]
      });
    }

    // Compare OTP
    const isValidOtp = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValidOtp) {
      return res.status(400).json({
        message: "Validation error",
        errors: ["Invalid OTP"]
      });
    }

    // Update verified status
    if (otpRecord.otpType === "email") {
      await User.updateOne({ email: sendBy }, { is_email_verified: true });
    } else {
      await User.updateOne({ mobile: sendBy }, { is_mobile_verified: true });
    }

    // Delete OTP after verification
    await OTP.deleteMany({ sendBy });

    // ✅ Response includes OTP (for testing only!)
    return res.status(200).json({
      message: "OTP verified successfully",
      otp  // <- OTP included for testing
    });

  } catch (err) {
    console.error("VERIFY OTP ERROR >>>", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



/* =====================================================
   GET ALL USERS
===================================================== */
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    if (!users.length) {
      return res.status(200).json({ message: "No users found" });
    }

    res.status(200).json({
      message: "Users fetched successfully",
      users
    });

  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};







exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
};