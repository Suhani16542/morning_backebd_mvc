const multer = require("multer");

const SingleImage = (req, res) => {
  try {
   
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: req.uploadedImage,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message:"Server error",
      error: error.message
    });
  }
};

const MultipleImages = (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      count:req.uploadedImages.length,
      data: req.uploadedImages,
    });

  } catch (err) {
 return res.status(500).json({
      success: false,
      massage:"Server error",
      error: err.message
    });
      
    }
  };

  module.exports = {
    SingleImage, MultipleImages
  }