const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 🧠 Extract job metadata from job description
router.post("/extract-metadata", async (req, res) => {
  const { jobDescription } = req.body;
  try {
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: `
Extract the following from this job description:
1. Company name
2. Job title
3. Location (city, state)
4. If available, hiring manager's name or title
5. Office mailing address if listed

Respond in JSON format.

Job Description:
${jobDescription}
        `,
        },
      ],
      temperature: 0.2,
    });

    const jsonStart = chatResponse.choices[0].message.content.indexOf("{");
    const metadata = JSON.parse(
      chatResponse.choices[0].message.content.slice(jsonStart)
    );
    res.json({ metadata });
  } catch (err) {
    console.error("❌ Failed to extract metadata:", err.message);
    res.status(500).json({ error: "Metadata extraction failed" });
  }
});

// ✍️ Generate AI cover letter
router.post("/cover-letter", async (req, res) => {
  const { resumeText, jobDescription, metadata = {} } = req.body;
  const {
    company = "the company",
    title = "the position",
    hiringManager = "Hiring Manager",
    address = "",
    location = "",
  } = metadata;

  const prompt = `
Write a personalized, professional cover letter for the role of "${title}" at "${company}".
Address it to "${hiringManager}".

Include the company address (if available):
${address || location}

Make sure it’s warm, confident, and tailored using the resume and job description below:

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const coverLetter = response.choices[0].message.content;
    res.json({ coverLetter });
  } catch (err) {
    console.error("❌ Error generating cover letter:", err.message);
    res.status(500).json({ error: "Failed to generate cover letter" });
  }
});

module.exports = router;
