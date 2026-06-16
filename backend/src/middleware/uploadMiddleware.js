const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ── Allowed MIME types ─────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];
const MAX_FILE_SIZE_MB   = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ── Cloudinary storage ─────────────────────────────────────────────────────────
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "d-fruit-products",
    allowed_formats: ALLOWED_EXTENSIONS,
    // Enforce a max dimension on Cloudinary's side as a second layer of defence
    transformation: [{ width: 1200, height: 1200, crop: "limit", quality: "auto" }],
  },
});

// ── File filter — runs BEFORE the file is uploaded to Cloudinary ───────────────
const fileFilter = (req, file, cb) => {
  // Check MIME type reported by the client
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Only JPG, PNG, and WebP images are allowed. Received: ${file.mimetype}`
      ),
      false
    );
  }

  // Check file extension as a second guard
  const ext = file.originalname.split(".").pop().toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Invalid file extension: .${ext}`
      ),
      false
    );
  }

  cb(null, true);
};

// ── Multer instance ────────────────────────────────────────────────────────────
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES, // 5 MB hard limit
    files: 1,                      // only one file per request
  },
});

// ── Error handler middleware ───────────────────────────────────────────────────
// Wraps multer's callback-style errors into clean JSON responses.
// Usage in routes: upload.single("image"), handleUploadError, yourController
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: `Image is too large. Maximum allowed size is ${MAX_FILE_SIZE_MB}MB.`,
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ message: err.field || err.message });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  // Not a multer error — pass to global error handler
  next(err);
};

module.exports = { upload, handleUploadError };