const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  toggleUserStatus,
  deleteUser
} = require("../Controllers/admin.controller");


// 1️⃣ GET ALL USERS
router.get("/users", getAllUsers);

// 2️⃣ ACTIVE / DEACTIVE USER
router.patch("/user/:id/status", toggleUserStatus);

// 3️⃣ DELETE USER
router.delete("/user/:id", deleteUser);

module.exports = router;
