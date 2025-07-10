const express = require("express");
const router = express.Router();

// Optional: use nodemailer or store in DB
router.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  console.log("📬 Contact message received:", { name, email, message });

  // Optional: email via nodemailer here

  res.json({ success: true });
});

module.exports = router;
