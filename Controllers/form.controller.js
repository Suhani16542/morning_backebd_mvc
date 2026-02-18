const { default: mongoose } = require("mongoose");
const Form = require("../Models/formSchema.model");
const Category = require("../Models/caregory.model"); 
/* ================= CREATE FORM ================= */
exports.formCreate = async (req, res) => {
  try {
    const adminId = req.user.userId;

    const {
      title,
      description,
      mainCategory,
      subCategory,
      formFees,
      platformCharge,
      requiredDocuments,
      applicationStartDate,
      applicationEndDate,
      examDate,
      resultDate,
      termsAndConditions,
      ...rest
    } = req.body;

    // ❗ REQUIRED VALIDATION
    if (!title || !description || !mainCategory) {
      return res.status(400).json({
        success: false,
        message: "title, description and main category are required",
      });
    }

    if (!applicationStartDate || !applicationEndDate) {
      return res.status(400).json({
        success: false,
        message: "applicationStartDate and applicationEndDate are required",
      });
    }

    if (formFees === undefined || platformCharge === undefined) {
      return res.status(400).json({
        success: false,
        message: "formFees and platformCharge are required",
      });
    }

    if (!termsAndConditions) {
      return res.status(400).json({
        success: false,
        message: "termsAndConditions must be accepted",
      });
    }

    // ✅ Prepare formData
    const formData = {
      title,
      description,
      mainCategory,
      subCategory: subCategory || null, // optional
      formFees: Number(formFees),
      platformCharge: Number(platformCharge),
      totalPayable: Number(formFees || 0) + Number(platformCharge || 0),
      applicationStartDate: new Date(applicationStartDate),
      applicationEndDate: new Date(applicationEndDate),
      examDate: examDate ? new Date(examDate) : null,
      resultDate: resultDate ? new Date(resultDate) : null,
      requiredDocuments: Array.isArray(requiredDocuments)
        ? requiredDocuments
        : [],
      termsAndConditions,
      createdBy: adminId,
      ...rest,
    };

    const form = await Form.create(formData);

    return res.status(201).json({
      success: true,
      message: "Form created successfully",
      data: form,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create form",
      error: error.message,
    });
  }
};

/* ================= GET ALL FORMS ================= */
exports.getAllForm = async (req, res) => {
  try {
    const forms = await Form.find()
      .populate("mainCategory", "name")
      .populate("subCategory", "name");

    return res.status(200).json({
      success: true,
      data: forms,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ================= GET FORM BY ID ================= */
exports.getFormById = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form id",
      });
    }

    const form = await Form.findById(id)
      .populate("mainCategory", "name")
      .populate("subCategory", "name");

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    // increase view count
    form.numberOfviews = (form.numberOfviews || 0) + 1;
    await form.save();

    return res.status(200).json({
      success: true,
      data: form,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch form",
      error: err.message,
    });
  }
};

/* ================= UPDATE FORM ================= */
exports.getUpdate = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form id",
      });
    }

    let updateData = { ...req.body };
    delete updateData.email; // optional, ignore email if sent

    const updatedForm = await Form.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedForm) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form updated successfully",
      data: updatedForm,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/* ================= DELETE FORM ================= */
exports.getdelete = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.trim();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form id",
      });
    }

    const deletedForm = await Form.findByIdAndDelete(id);

    if (!deletedForm) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Form deleted successfully",
      data: deletedForm,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};


/**
 * GET FORM BY ID (for update page)
 * /getUpdate/:id
 */
exports.getUpdate = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid form id",
      });
    }

    const form = await Form.findById(id)
      .populate("mainCategory", "name")
      .populate("subCategory", "name");

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: form,
    });
  } catch (error) {
    console.error("getUpdate error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch form",
      error: error.message,
    });
  }
};

/**
 * @desc    Filter Forms
 * @route   GET /api/forms/filter
 * @access  Public
 */
exports.filterForms = async (req, res) => {
  try {
    const {
      search,
      maincategory,
      subcategory,
      minFee,
      maxFee,
      startDate,
      endDate,
      isActive,
      isFeatured,
      visibility,
      paymentRequired,
      page = 1,
      limit = 10,
      sortBy
    } = req.query;

    let filter = {};

    /* ================= SEARCH ================= */
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

  /* ================= CATEGORY ================= */
if (maincategory) {
  const mainCat = await Category.findOne({ slug: maincategory });

  if (!mainCat) {
    return res.status(200).json({
      success: true,
      total: 0,
      page: Number(page),
      pages: 0,
      count: 0,
      data: []
    });
  }

  filter.mainCategory = mainCat._id;
}

if (subcategory) {
  const subCat = await Category.findOne({ slug: subcategory });

  if (!subCat) {
    return res.status(200).json({
      success: true,
      total: 0,
      page: Number(page),
      pages: 0,
      count: 0,
      data: []
    });
  }

  filter.subCategory = subCat._id;
}


    /* ================= FEES ================= */
    if (minFee || maxFee) {
      filter.totalPayable = {};
      if (minFee) filter.totalPayable.$gte = Number(minFee);
      if (maxFee) filter.totalPayable.$lte = Number(maxFee);
    }

    /* ================= DATE ================= */
    if (startDate || endDate) {
      filter.applicationStartDate = {};
      if (startDate) filter.applicationStartDate.$gte = new Date(startDate);
      if (endDate) filter.applicationStartDate.$lte = new Date(endDate);
    }

    /* ================= STATUS ================= */
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    if (paymentRequired !== undefined) {
      filter.paymentRequired = paymentRequired === "true";
    }

    if (visibility) {
      filter.visibility = visibility;
    }

    /* ================= SORT ================= */
    let sort = {};
    switch (sortBy) {
      case "latest":
        sort.createdAt = -1;
        break;
      case "oldest":
        sort.createdAt = 1;
        break;
      case "feeLow":
        sort.totalPayable = 1;
        break;
      case "feeHigh":
        sort.totalPayable = -1;
        break;
      case "popular":
        sort.numberOfViews = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const forms = await Form.find(filter)
      .populate("mainCategory", "name slug")
      .populate("subCategory", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Form.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      count: forms.length,
      data: forms
    });

  } catch (error) {
    console.error("Filter Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};


exports.getSingleForm = async (req, res) => {
  try {
    const { slug } = req.params;

    console.log("Slug received:", slug); // 👈 ye add karo test ke liye

    const form = await Form.findOne({ slug });

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found"
      });
    }

    res.status(200).json({
      success: true,
      data: form
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
