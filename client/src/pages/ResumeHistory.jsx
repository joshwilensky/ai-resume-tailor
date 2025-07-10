import { useEffect, useState } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { Document, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

export default function ResumeHistory() {
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [editedJobDesc, setEditedJobDesc] = useState("");
  const [generatingIdx, setGeneratingIdx] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/resume-history?userId=demo")
      .then((res) => {
        setHistory(res.data.history);
        setFiltered(res.data.history);
      })
      .catch(() => alert("Failed to load history"));
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const result = history.filter(
      (entry) =>
        entry.jobDescription.toLowerCase().includes(term) ||
        entry.tailoredResume.toLowerCase().includes(term)
    );
    setFiltered(result);
  }, [search, history]);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleClear = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your entire history?"
    );
    if (!confirmed) return;
    try {
      await axios.delete(
        "http://localhost:5000/api/resume-history?userId=demo"
      );
      setHistory([]);
      setFiltered([]);
    } catch {
      alert("Failed to clear history");
    }
  };

  const exportToPDF = (content, filename) => {
    html2pdf()
      .from(content)
      .set({
        margin: 0.5,
        filename,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
      })
      .save();
  };

  const exportToWord = (text, filename) => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [new TextRun({ text, font: "Arial" })],
            }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, filename);
    });
  };

  const handleEdit = (entry) => {
    setEditingEntry(entry);
    setEditedJobDesc(entry.jobDescription);
  };

  const submitEdit = async () => {
    if (!editedJobDesc.trim()) return;

    try {
      await axios.put(
        `http://localhost:5000/api/resume-history/${editingEntry._id}`,
        {
          jobDescription: editedJobDesc,
        }
      );

      const updated = history.map((item) =>
        item._id === editingEntry._id
          ? { ...item, jobDescription: editedJobDesc }
          : item
      );

      setHistory(updated);
      setFiltered(updated);
      setEditingEntry(null);
    } catch {
      alert("Failed to update");
    }
  };

  const handleDelete = async (entryId, index) => {
    const confirmed = window.confirm("Delete this resume entry?");
    if (!confirmed) return;
    try {
      await axios.delete(`http://localhost:5000/api/resume-history/${entryId}`);
      const newHistory = history.filter((_, i) => i !== index);
      setHistory(newHistory);
      setFiltered(newHistory);
      setOpenIndex(null);
    } catch {
      alert("Failed to delete entry");
    }
  };

  const generateCoverLetter = async (entry, index) => {
    setGeneratingIdx(index);
    try {
      const res = await axios.post("http://localhost:5000/api/cover-letter", {
        resumeText: entry.resumeText,
        jobDescription: entry.jobDescription,
      });

      const updated = [...history];
      updated[index].coverLetter = res.data.coverLetter;

      // Save to DB
      await axios.put(`http://localhost:5000/api/resume-history/${entry._id}`, {
        coverLetter: res.data.coverLetter,
      });

      setHistory(updated);
      setFiltered(updated);
    } catch (err) {
      alert("❌ Failed to generate cover letter.");
    } finally {
      setGeneratingIdx(null);
    }
  };


  return (
    <div className='max-w-5xl mx-auto px-4 py-10'>
      <h1 className='text-3xl font-bold mb-6'>📂 Resume Tailoring History</h1>

      <div className='flex justify-between items-center mb-4'>
        <h2 className='text-lg font-semibold'>
          📜 Your Resume Tailoring History
        </h2>
        <button
          onClick={handleClear}
          className='bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm rounded'>
          🗑 Clear History
        </button>
      </div>

      <input
        type='text'
        placeholder='🔍 Filter by keyword...'
        className='w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p className='text-gray-600'>No matching history found.</p>
      ) : (
        <div className='space-y-4'>
          {filtered.map((entry, idx) => (
            <div
              key={entry._id}
              className='border border-gray-200 rounded-lg shadow-sm'>
              <button
                onClick={() => toggleAccordion(idx)}
                className='w-full flex justify-between items-center px-4 py-3 bg-gray-100 text-left text-sm font-medium hover:bg-gray-200'>
                <span>
                  📄 Resume #{filtered.length - idx} —{" "}
                  {entry.jobDescription.slice(0, 60)}...
                </span>
                <span>{openIndex === idx ? "▲" : "▼"}</span>
              </button>

              {openIndex === idx && (
                <div className='p-4 border-t border-gray-200 bg-white text-sm space-y-4'>
                  <div className='text-xs text-gray-500 italic'>
                    Created: {new Date(entry.createdAt).toLocaleString()}
                  </div>

                  <div>
                    <h3 className='font-semibold text-gray-700 mb-1'>
                      🧾 Job Description:
                    </h3>
                    <div className='bg-gray-50 border p-3 rounded max-h-40 overflow-auto whitespace-pre-wrap'>
                      {entry.jobDescription}
                    </div>
                  </div>

                  <div>
                    <h3 className='font-semibold text-gray-700 mb-1'>
                      🎯 Tailored Resume:
                    </h3>
                    <div
                      className='bg-gray-50 border p-3 rounded max-h-60 overflow-auto whitespace-pre-wrap'
                      id={`resume-${idx}`}>
                      {entry.tailoredResume}
                    </div>

                    <div className='flex gap-2 mt-2 flex-wrap'>
                      <button
                        onClick={() =>
                          exportToPDF(
                            document.getElementById(`resume-${idx}`),
                            `Tailored_Resume_${idx + 1}.pdf`
                          )
                        }
                        className='text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded'>
                        ⬇ Export as PDF
                      </button>
                      <button
                        onClick={() =>
                          exportToWord(
                            entry.tailoredResume,
                            `Tailored_Resume_${idx + 1}.docx`
                          )
                        }
                        className='text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded'>
                        ⬇ Export as Word
                      </button>
                      <button
                        onClick={() => handleEdit(entry)}
                        className='text-sm bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded'>
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(entry._id, idx)}
                        className='text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded'>
                        🗑 Delete
                      </button>
                      <button
                        onClick={() => generateCoverLetter(entry, idx)}
                        className='text-sm bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded'
                        disabled={generatingIdx === idx}>
                        {generatingIdx === idx
                          ? "⏳ Generating..."
                          : "📬 Generate Cover Letter"}
                      </button>
                    </div>
                  </div>

                  {entry.coverLetter && (
                    <div>
                      <h3 className='font-semibold text-gray-700 mt-4 mb-1'>
                        📬 AI Cover Letter:
                      </h3>
                      <div className='bg-gray-50 border p-3 rounded max-h-60 overflow-auto whitespace-pre-wrap'>
                        {entry.coverLetter}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✨ Edit Modal */}
      {editingEntry && (
        <div className='fixed inset-0 bg-gray-500/50 bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white w-full max-w-lg rounded-lg p-6 shadow-lg'>
            <h2 className='text-xl font-bold mb-4'>✏️ Edit Job Description</h2>
            <textarea
              className='w-full h-40 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring focus:ring-blue-400'
              value={editedJobDesc}
              onChange={(e) => setEditedJobDesc(e.target.value)}
            />
            <div className='flex justify-end gap-3 mt-4'>
              <button
                className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded'
                onClick={() => setEditingEntry(null)}>
                Cancel
              </button>
              <button
                className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded'
                onClick={submitEdit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
