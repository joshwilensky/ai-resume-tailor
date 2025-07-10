// FILE: backend/routes/tailor.js
const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/tailor", async (req, res) => {
  const { resumeText, jobDescription } = req.body;
  console.log("📝 Received resumeText and jobDescription");

  if (!resumeText || !jobDescription) {
    console.log("❌ Missing inputs");
    return res.status(400).json({ error: "Missing inputs" });
  }

  const prompt = `
You are a professional resume writing assistant. Your task is to rewrite a candidate's resume so that it aligns more closely with the job description provided. Incorporate relevant keywords, tone, and responsibilities from the job description where applicable.

Resume:
${resumeText}

Job Description:
${jobDescription}

Rewritten Tailored Resume:
`;

  try {
    console.log("🚀 Sending prompt to OpenAI...");

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const tailoredResume = chatResponse.choices[0].message.content;
    console.log("✅ AI responded successfully");
    res.json({ tailoredResume });
  } catch (err) {
    console.error("❌ Error in /api/tailor:", err.message);
    console.error("Details:", err.response?.data || err);
    res.status(500).json({
      error: "AI error",
      message: err.message,
      details: err.response?.data || null,
    });
  }
});

module.exports = router;
