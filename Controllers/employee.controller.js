const User = require("../Models/user.model"); // 👈 same User schema

/**
 * =========================
 * CREATE EMPLOYEE
 * =========================
 */
exports.createEmployee = async (req, res) => {
  try {
    const employee = await User.create({
      ...req.body,
      role: "employee" // 👈 fixed role
    });

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: employee
    });
  } catch (error) {
    console.log("CREATE EMPLOYEE ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =========================
 * GET ALL EMPLOYEES
 * =========================
 */
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: employees
    });
  } catch (error) {
    console.log("GET ALL EMPLOYEE ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =========================
 * GET SINGLE EMPLOYEE (EDIT)
 * =========================
 */
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findOne({
      _id: req.params.id,
      role: "employee"
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.log("GET EMPLOYEE BY ID ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =========================
 * UPDATE EMPLOYEE
 * =========================
 */
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await User.findOneAndUpdate(
      { _id: req.params.id, role: "employee" },
      req.body,
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.json({
      success: true,
      message: "Employee updated successfully",
      data: employee
    });
  } catch (error) {
    console.log("UPDATE EMPLOYEE ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * =========================
 * DELETE EMPLOYEE
 * =========================
 */
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findOneAndDelete({
      _id: req.params.id,
      role: "employee"
    });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found"
      });
    }

    res.json({
      success: true,
      message: "Employee deleted successfully"
    });
  } catch (error) {
    console.log("DELETE EMPLOYEE ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
