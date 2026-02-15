import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-blue-500">
            VideoAnnotation
          </Link>
          <div className="space-x-4">
            <Link to="/login" className="text-gray-700 hover:text-blue-500">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-500">
              Register
            </Link>
            <Link to="/dashboard" className="text-gray-700 hover:text-blue-500">
              Dashboard
            </Link>
            <Link to="/admin" className="text-gray-700 hover:text-blue-500">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
export default Navbar