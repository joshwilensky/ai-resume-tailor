const mongoose = require("mongoose");

const resumeHistorySchema = new mongoose.Schema(
  {
    userId: String,
    title: { type: String, default: "" },
    resumeText: String,
    jobDescription: String,
    tailoredResume: String,
    coverLetter: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeHistory", resumeHistorySchema);
