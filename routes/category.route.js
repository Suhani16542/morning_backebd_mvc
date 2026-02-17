const express = require("express");
const router = express.Router();

const {
  createCategory,
  getMainCategories,
  getSubCategoriesBySlug,
    toggleCategoryActive,
} = require("../Controllers/category.controller");

// CREATE
router.post("/create", createCategory);

// READ
router.get("/main", getMainCategories);
router.get("/:slug/sub", getSubCategoriesBySlug);
// 🔥 ACTIVE / DEACTIVE
router.patch("/:id/toggle-active", toggleCategoryActive);

module.exports = router;
