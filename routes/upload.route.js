const express = require("express");
const router = express.Router();
const {upload, singleImageUpload, multipleImageUpload}= require ("../Config/cloudinarymulter");
const {SingleImage, MultipleImages} = require ("../Controllers/upload.controller");


router.post("/single-image", upload.single("image"),singleImageUpload("single-images"), SingleImage)

router.post("/multiple-images", upload.array("images",5),multipleImageUpload("multiple-images"), MultipleImages)


module.exports = router