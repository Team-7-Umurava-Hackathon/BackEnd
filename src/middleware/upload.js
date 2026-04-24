import multer from "multer";

// Store files in memory only (no disk storage)
const storage = multer.memoryStorage();

// File filter - validate file type
const fileFilter = (req, file, cb) => {
  const fileType = req.query.type || req.body.type;

  if (!fileType) {
    return cb(new Error("File type (pdf, csv, or xls) must be specified"), false);
  }

  if (fileType === "pdf" && file.mimetype === "application/pdf") {
    cb(null, true);
  } else if (fileType === "csv" && file.mimetype === "text/csv") {
    cb(null, true);
  } else if (
    fileType === "xls" &&
    (file.mimetype === "application/vnd.ms-excel" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  ) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type for ${fileType}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB max
  }
});

export default upload;