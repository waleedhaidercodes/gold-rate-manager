import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Gold Manager</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-blue-200">Dashboard</Link>
          <Link to="/rates" className="hover:text-blue-200">Rates</Link>
          <Link to="/investments" className="hover:text-blue-200">Investments</Link>
          <div className="border-l border-blue-400 pl-4 ml-4 flex items-center gap-4">
            <span className="text-sm">Hello, {user?.name}</span>
            <button 
                onClick={logout} 
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
            >
                Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
