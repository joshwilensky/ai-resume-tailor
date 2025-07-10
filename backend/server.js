const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api", require("./routes/tailor"));
app.use("/api", require("./routes/coverLetter"));
app.use("/api", require("./routes/resumeHistory")); // <- MUST exist
app.use("/api", require("./routes/uploadResume")); // <- file upload for resume parsing

// Test Route (optional)
app.get("/", (req, res) => {
  res.send("AI Resume Builder backend is running.");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
