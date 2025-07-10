import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TailorResumeForm from "./components/TailorResumeForm";
import LandingPage from "./pages/LandingPage";
import Navbar from "./components/Navbar";
import ResumeHistory from "./pages/ResumeHistory";
import Contact from "./pages/Contact";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/tailor' element={<TailorResumeForm />} />
        <Route path='/history' element={<ResumeHistory />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
    </Router>
  );
}
