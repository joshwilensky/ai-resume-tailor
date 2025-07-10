const express = require("express");
const router = express.Router();
const ResumeHistory = require("../models/ResumeHistory");

// Save tailored result
router.post("/resume-history", async (req, res) => {
  const {
    userId = "demo",
    resumeText,
    jobDescription,
    tailoredResume,
  } = req.body;
  try {
    const entry = new ResumeHistory({
      userId,
      resumeText,
      jobDescription,
      tailoredResume,
    });
    await entry.save();
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to save resume history:", err);
    res.status(500).json({ error: "Failed to save" });
  }
});

// Get history
router.get("/resume-history", async (req, res) => {
  const userId = req.query.userId || "demo";
  try {
    const entries = await ResumeHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json({ history: entries });
  } catch (err) {
    console.error("❌ Failed to fetch history:", err);
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// Clear all history for a user
router.delete("/resume-history", async (req, res) => {
  const userId = req.query.userId || "demo";
  try {
    await ResumeHistory.deleteMany({ userId });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to clear history:", err);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// Update an entry's title, notes, or coverLetter
router.put("/resume-history/:id", async (req, res) => {
  const { title, notes, coverLetter } = req.body;
  try {
    await ResumeHistory.findByIdAndUpdate(req.params.id, { title, notes, coverLetter });
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to update:", err);
    res.status(500).json({ error: "Failed to update" });
  }
});

// Delete individual entry
router.delete("/resume-history/:id", async (req, res) => {
  try {
    await ResumeHistory.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("❌ Failed to delete entry:", err);
    res.status(500).json({ error: "Failed to delete" });
  }
});


module.exports = router;
