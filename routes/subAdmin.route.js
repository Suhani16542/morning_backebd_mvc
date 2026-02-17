const express = require("express");
const app = express();

const {
  createSubAdmin,
  getAllSubAdmins,
  getSubAdminById,
  updateSubAdmin,
  deleteSubAdmin
} = require("../Controllers/subAdmin.controller");

const { authenticate, authorize } = require("../middleware/auth.middleware");

// CREATE SUB-ADMIN
app.post(
  "/create",
  authenticate,
  authorize("admin"),
  createSubAdmin
);

// GET ALL SUB-ADMINS
app.get(
  "/get-all",
  authenticate,
  authorize("admin"),
  getAllSubAdmins
);

// GET SUB-ADMIN (EDIT)
app.get(
  "/get/:id",
  authenticate,
  authorize("admin"),
  getSubAdminById
);

// UPDATE SUB-ADMIN
app.put(
  "/update/:id",
  authenticate,
  authorize("admin"),
  updateSubAdmin
);

// DELETE SUB-ADMIN
app.delete(
  "/delete/:id",
  authenticate,
  authorize("admin"),
  deleteSubAdmin
);

module.exports = app;
