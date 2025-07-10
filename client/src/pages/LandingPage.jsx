import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-6'>
      <div className='max-w-2xl text-center'>
        <h1 className='text-4xl font-bold mb-4 text-gray-900'>
          AI-Tailored Resumes That Win Interviews
        </h1>
        <p className='text-gray-600 mb-6 text-lg'>
          Paste your resume and job description — and instantly get a tailored
          version that speaks the employer’s language.
        </p>
        <Link
          to='/tailor'
          className='bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium shadow hover:bg-blue-700 transition'>
          ✨ Tailor My Resume
        </Link>
      </div>
    </div>
  );
}
