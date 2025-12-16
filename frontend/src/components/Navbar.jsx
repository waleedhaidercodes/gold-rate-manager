import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { logout, user } = useAuth();

  return (
    <nav className="bg-dark-800 text-gray-100 shadow-md border-b border-gold-500/20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif font-bold text-gold-500">Gold Smith</Link>
        <div className="space-x-4 flex items-center">
          <Link to="/" className="hover:text-gold-400 transition">Dashboard</Link>
          <Link to="/silver" className="hover:text-gold-400 transition">Silver</Link>
          <Link to="/rates" className="hover:text-gold-400 transition">Rates</Link>
          <Link to="/investments" className="hover:text-gold-400 transition">Investments</Link>
          <div className="border-l border-gray-600 pl-4 ml-4 flex items-center gap-4">
            <span className="text-sm text-gold-400">Hello, {user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm transition text-white"
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
