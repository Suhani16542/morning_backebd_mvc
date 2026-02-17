const multer = require("multer");
const cloudinary = require("./cloudinary");
const { v4: uuidv4 } = require("uuid");

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("INVALID_FILE_TYPE"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter,
});

const uploadToCloudinary = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          public_id: uuidv4(),
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      )
      .end(file.buffer);
  });
};

// SINGLE
const singleImageUpload = (folder = "images") => {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image file is required",
        });
      }

      const result = await uploadToCloudinary(req.file, folder);

      req.uploadedImage = {
        url: result.secure_url,
        public_id: result.public_id,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

// MULTIPLE
const multipleImageUpload = (folder = "images") => {
  return async (req, res, next) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one image is required",
        });
      }

      const uploads = req.files.map((file) =>
        uploadToCloudinary(file, folder)
      );

      const results = await Promise.all(uploads);

      req.uploadedImages = results.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  upload,
  singleImageUpload,
  multipleImageUpload,
};
 
