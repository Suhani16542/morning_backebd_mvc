const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const{validateCreateForm} =require("../middleware/validate.middleware")

const { formCreate,getAllForm,getFormById,getUpdate,getdelete,filterForms } = require("../Controllers/form.controller");

// POST /api/forms/create
router.post("/create",authenticate,validateCreateForm ,authorize("admin", "editor"),   formCreate  );
router.get("/getAllForm",getAllForm)
router.get("/getFormById/:id", getFormById);
router.get("/getUpdate/:id",authenticate,authorize("admin"),getUpdate)
router.get("/getdelete/:id",authenticate,authorize("admin"),getdelete)
router.get("/filter",filterForms)

module.exports = router;
