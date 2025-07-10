import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className='bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex justify-between items-center'>
        <Link to='/' className='text-xl font-bold text-blue-600'>
          TailorMyResume.ai
        </Link>
        <div className='flex space-x-6 text-sm font-medium'>
          <Link
            to='/tailor'
            className='text-gray-700 hover:text-blue-600 transition'>
            Tailor
          </Link>
          <Link
            to='/history'
            className='text-gray-700 hover:text-blue-600 transition'>
            History
          </Link>
          <Link
            to='/contact'
            className='text-gray-700 hover:text-blue-600 transition'>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  );
}
