const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "uploads/";

    if (
      req.originalUrl.includes("/savesyllabus") || 
      req.body.folder === "syllabus"               
    ) {
      folder = "uploads/syllabus/";
    }

    if (
      req.originalUrl.includes("/saveAssignment") || 
      req.body.folder === "assignment"               
    ) {
      folder = "uploads/assignment/";
    }

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
