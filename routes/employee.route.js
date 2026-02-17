const express = require("express");
const app = express();

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
} = require("../Controllers/employee.controller");

const { authenticate, authorize } = require("../middleware/auth.middleware");
const upload = require("../Config/multer");

// CREATE EMPLOYEE (Admin / Sub-Admin)
app.post(
  "/create",
  authenticate,
  authorize("admin", "sub-admin"),
  upload.array("documents"),
  createEmployee
);

// GET ALL EMPLOYEES
app.get(
  "/get-all",
  authenticate,
  authorize("admin", "sub-admin"),
  getAllEmployees
);

// GET SINGLE EMPLOYEE (EDIT FORM)
app.get(
  "/get/:id",
  authenticate,
  authorize("admin", "sub-admin"),
  getEmployeeById
);

// UPDATE EMPLOYEE
app.put(
  "/update/:id",
  authenticate,
  authorize("admin", "sub-admin"),
  upload.array("documents"),
  updateEmployee
);

// DELETE EMPLOYEE
app.delete(
  "/delete/:id",
  authenticate,
  authorize("admin"),
  deleteEmployee
);

module.exports = app;
