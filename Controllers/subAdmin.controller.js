const User = require("../Models/user.model"); // ✅ USER schema use hoga

/**
 * CREATE SUB-ADMIN
 */
exports.createSubAdmin = async (req, res) => {
  try {
    const { username, email, password, mobile } = req.body;

    // basic validation
    if (!username || !email || !password || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const subAdmin = await User.create({
      username,
      email,
      password,
      mobile,
      role: "subadmin" // ✅ same enum
    });

    res.status(201).json({
      success: true,
      message: "Sub-admin created successfully",
      data: subAdmin
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET ALL SUB-ADMINS
 */
exports.getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await User.find({ role: "subadmin" });

    res.json({
      success: true,
      data: subAdmins
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * GET SUB-ADMIN BY ID
 */
exports.getSubAdminById = async (req, res) => {
  try {
    const subAdmin = await User.findOne({
      _id: req.params.id,
      role: "subadmin"
    });

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub-admin not found"
      });
    }

    res.json({
      success: true,
      data: subAdmin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * UPDATE SUB-ADMIN
 */
exports.updateSubAdmin = async (req, res) => {
  try {
    const subAdmin = await User.findOneAndUpdate(
      { _id: req.params.id, role: "subadmin" },
      req.body,
      { new: true }
    );

    if (!subAdmin) {
      return res.status(404).json({
        success: false,
        message: "Sub-admin not found"
      });
    }

    res.json({
      success: true,
      message: "Sub-admin updated successfully",
      data: subAdmin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * DELETE SUB-ADMIN
 */
exports.deleteSubAdmin = async (req, res) => {
  try {
    const deleted = await User.findOneAndDelete({
      _id: req.params.id,
      role: "subadmin"
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Sub-admin not found"
      });
    }

    res.json({
      success: true,
      message: "Sub-admin deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
