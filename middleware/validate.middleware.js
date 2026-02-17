/**
 * FORM REQUIRED FIELDS VALIDATION
 */
exports.validateCreateForm = (req, res, next) => {
  const {
    title,
    description,
    mainCategory,
    subCategory,
    applicationStartDate,
    applicationEndDate,
    formFees,
    platformCharge,
    termsAndConditions
  } = req.body;

  /* ===== BASIC INFO ===== */
  if (!title || !description || !mainCategory || !subCategory) {
    return res.status(400).json({
      success: false,
      message: "title, description and category are required"
    });
  }

  /* ===== IMPORTANT DATES ===== */
  if (!applicationStartDate || !applicationEndDate) {
    return res.status(400).json({
      success: false,
      message: "applicationStartDate and applicationEndDate are required"
    });
  }

  if (new Date(applicationStartDate) > new Date(applicationEndDate)) {
    return res.status(400).json({
      success: false,
      message: "Application start date cannot be after end date"
    });
  }

  /* ===== FEES ===== */
  if (formFees === undefined || platformCharge === undefined) {
    return res.status(400).json({
      success: false,
      message: "formFees and platformCharge are required"
    });
  }

  if (formFees < 0 || platformCharge < 0) {
    return res.status(400).json({
      success: false,
      message: "formFees and platformCharge must be >= 0"
    });
  }

  /* ===== TERMS ===== */
  if (!termsAndConditions) {
    return res.status(400).json({
      success: false,
      message: "termsAndConditions is required"
    });
  }

  next();
};
