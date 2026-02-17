const Category = require("../Models/caregory.model");

/* ================= CREATE CATEGORY ================= */
exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, parent, level } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    if (level === 2 && !parent) {
      return res.status(400).json({
        success: false,
        message: "Parent category is required for sub-category",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      parent: level === 2 ? parent : null,
      level,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET MAIN CATEGORIES ================= */
exports.getMainCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      level: 1,
      parent: null,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET SUB BY SLUG ================= */
exports.getSubCategoriesBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const mainCategory = await Category.findOne({
      slug,
      level: 1,
    });

    if (!mainCategory) {
      return res.status(404).json({
        success: false,
        message: "Main category not found",
      });
    }

    const subCategories = await Category.find({
      parent: mainCategory._id,
      level: 2,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      parent: mainCategory,
      data: subCategories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= TOGGLE ACTIVE / DEACTIVE ================= */
exports.toggleCategoryActive = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const newStatus = !category.isActive;
    category.isActive = newStatus;
    await category.save();

    // 🔥 MAIN → ALL SUB TOGGLE
    if (category.level === 1) {
      await Category.updateMany(
        { parent: category._id },
        { $set: { isActive: newStatus } }
      );
    }

    // 🚫 SUB cannot activate if parent inactive
    if (category.level === 2 && newStatus === true) {
      const parentCategory = await Category.findById(category.parent);
      if (!parentCategory || !parentCategory.isActive) {
        category.isActive = false;
        await category.save();

        return res.status(400).json({
          success: false,
          message: "Parent category is inactive",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: newStatus
        ? "Category Activated"
        : "Category Deactivated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
