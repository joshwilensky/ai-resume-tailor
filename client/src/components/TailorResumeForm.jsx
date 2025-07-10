import { useState } from "react";
import axios from "axios";
import ResumeDiffView from "./ResumeDiffView";
import html2pdf from "html2pdf.js";

export default function TailorResumeForm() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [loading, setLoading] = useState(false);
  const [coverLoading, setCoverLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);
    setUploading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/upload-resume",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResumeText(res.data.text); // auto-fill
    } catch (err) {
      alert("Failed to extract resume from PDF.");
    } finally {
      setUploading(false);
    }
  };

  const handleTailor = async () => {
    if (!resumeText || !jobDescription) return;
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/tailor", {
        resumeText,
        jobDescription,
      });

      const result = res.data.tailoredResume;
      setTailoredResume(result);

      // Save entry to localStorage
      const previous = JSON.parse(
        localStorage.getItem("resumeHistory") || "[]"
      );
      const newEntry = { resumeText, jobDescription, tailoredResume: result };
      await axios.post("http://localhost:5000/api/resume-history", {
        userId: "demo", // change later when auth is added
        resumeText,
        jobDescription,
        tailoredResume: result,
      });
    } catch (err) {
      alert("Something went wrong while tailoring the resume.");
    } finally {
      setLoading(false);
    }
  };

  const handleCoverLetter = async () => {
    if (!resumeText || !jobDescription) return;
    setCoverLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/cover-letter", {
        resumeText,
        jobDescription,
      });
      setCoverLetter(res.data.coverLetter);
    } catch (err) {
      alert("Failed to generate cover letter.");
    } finally {
      setCoverLoading(false);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById("tailoredResumeSection");
    html2pdf()
      .from(element)
      .set({
        margin: 0.5,
        filename: "Tailored_Resume.pdf",
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>
      <h1 className='text-3xl font-bold mb-6 text-center'>
        🎯 Tailor My Resume
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        <div>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='font-semibold'>📄 Upload or Paste Your Resume</h2>

            <label className='relative inline-flex items-center cursor-pointer'>
              <input
                type='file'
                accept='.pdf'
                onChange={handleResumeUpload}
                className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
              />
            </label>
          </div>

          <textarea
            className='w-full h-60 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-400'
            placeholder='Paste your resume here or upload a PDF above...'
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
          />
          <span className='bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition'>
            {uploading ? "Uploading..." : "Upload PDF or Word doc."}
          </span>
        </div>

        <div>
          <h2 className='font-semibold mb-2'>🧾 Paste Job Description</h2>
          <textarea
            className='w-full h-60 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-400'
            placeholder='Paste the job description here...'
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>

      <div className='flex flex-wrap justify-center gap-4 mb-10'>
        <button
          onClick={handleTailor}
          className='bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50'
          disabled={loading}>
          {loading ? "Tailoring..." : "✨ Tailor Resume"}
        </button>

        <button
          onClick={handleCoverLetter}
          className='bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition disabled:opacity-50'
          disabled={coverLoading}>
          {coverLoading ? "Generating..." : "✍️ Generate Cover Letter"}
        </button>
      </div>

      {tailoredResume && (
        <div className='mb-10'>
          <div className='flex items-center justify-between mb-3'>
            <h2 className='text-2xl font-semibold'>🎉 Tailored Resume</h2>
            <div className='flex items-center gap-4'>
              <label className='flex items-center space-x-2'>
                <input
                  type='checkbox'
                  checked={showDiff}
                  onChange={() => setShowDiff(!showDiff)}
                  className='accent-blue-600'
                />
                <span className='text-sm text-gray-600'>Show Diff View</span>
              </label>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(tailoredResume);
                  alert("✅ Resume copied to clipboard");
                }}
                className='text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600'>
                📋 Copy to Clipboard
              </button>

              <button
                onClick={downloadPDF}
                className='text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700'>
                ⬇️ Download as PDF
              </button>
            </div>
          </div>

          <div id='tailoredResumeSection'>
            {showDiff ? (
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-sm font-medium text-gray-600 mb-1'>
                    Original Resume
                  </h3>
                  <div className='bg-white border border-gray-200 p-4 text-sm rounded-lg whitespace-pre-wrap max-h-[500px] overflow-auto'>
                    {resumeText}
                  </div>
                </div>

                <div>
                  <h3 className='text-sm font-medium text-gray-600 mb-1'>
                    Tailored Resume
                  </h3>
                  <ResumeDiffView
                    original={resumeText}
                    modified={tailoredResume}
                  />
                </div>
              </div>
            ) : (
              <div className='bg-gray-100 p-5 rounded-lg whitespace-pre-wrap text-sm leading-relaxed max-h-[500px] overflow-auto border border-gray-200'>
                {tailoredResume}
              </div>
            )}
          </div>
        </div>
      )}

      {coverLetter && (
        <div>
          <h2 className='text-2xl font-semibold mb-3'>
            📬 AI-Generated Cover Letter
          </h2>
          <div className='bg-gray-50 border border-gray-200 p-5 rounded-lg text-sm whitespace-pre-wrap leading-relaxed'>
            {coverLetter}
          </div>
        </div>
      )}
    </div>
  );

}
