import { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      await axios.post("/api/contact", form);
      setStatus("✅ Message sent!");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("❌ Failed to send message.");
    }
  };

  return (
    <div className='max-w-xl mx-auto px-4 py-12'>
      <h1 className='text-3xl font-bold mb-6'>📬 Contact Us</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          required
          placeholder='Your name'
          className='w-full border border-gray-300 rounded px-3 py-2'
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type='email'
          required
          placeholder='Your email'
          className='w-full border border-gray-300 rounded px-3 py-2'
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          required
          placeholder='Your message'
          className='w-full border border-gray-300 rounded px-3 py-2 h-40'
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button
          type='submit'
          className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>
          Send Message
        </button>
      </form>
      {status && <p className='mt-4 text-sm text-gray-600'>{status}</p>}
    </div>
  );
}
