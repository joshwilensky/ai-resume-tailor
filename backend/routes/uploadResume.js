const express = require("express");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");

const upload = multer({ dest: "uploads/" });

router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  const filePath = req.file.path;

  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    res.json({ text: pdfData.text });
  } catch (err) {
    console.error("❌ PDF parsing error:", err);
    res.status(500).json({ error: "Failed to extract text from resume." });
  } finally {
    fs.unlinkSync(filePath); // clean up temp file
  }
});

module.exports = router;
