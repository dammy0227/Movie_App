import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { Search, Film, Tv, User, LogOut, Menu, X, Sparkles, Star } from 'lucide-react'; // Added Star

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="bg-black/90 fixed w-full z-50 top-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="shrink-0">
            <h1 className="text-2xl font-bold text-red-600">MOVIE BOX</h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/dashboard" className="text-white hover:text-red-600 transition">Home</Link>
            
            {/* Movies Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white hover:text-red-600 transition">
                <Film className="w-4 h-4" />
                <span>Movies</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/movies" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  All Movies
                </Link>
                <Link to="/movies?category=trending" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Trending
                </Link>
                <Link to="/movies?category=popular" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Popular
                </Link>
                <Link to="/movies?category=topRated" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Top Rated
                </Link>
              </div>
            </div>

            {/* TV Shows Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 text-white hover:text-red-600 transition">
                <Tv className="w-4 h-4" />
                <span>TV Shows</span>
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/tv" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  All TV Shows
                </Link>
                <Link to="/tv?category=trending" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Trending
                </Link>
                <Link to="/tv?category=popular" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Popular
                </Link>
                <Link to="/tv?category=topRated" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Top Rated
                </Link>
                <Link to="/tv?category=airingToday" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Airing Today
                </Link>
              </div>
            </div>

            <Link to="/watchlist" className="text-white hover:text-red-600 transition">Watchlist</Link>
            
            {/* ADD THIS - Ratings Link */}
            <Link to="/ratings" className="flex items-center space-x-1 text-white hover:text-red-600 transition">
              <Star className="w-4 h-4" />
              <span>My Ratings</span>
            </Link>
            
            <Link to="/ai-suggestions" className="flex items-center space-x-1 text-white hover:text-red-600 transition">
              <Sparkles className="w-4 h-4" />
              <span>AI Suggestions</span>
            </Link>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies & TV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 text-white px-4 py-1 pr-10 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-600 w-48"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </form>

            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-white hover:text-red-600">
                <User className="w-5 h-5" />
                <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/profile" className="block px-4 py-2 text-sm text-white hover:bg-gray-800">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-red-600"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-900 px-4 py-4">
          <div className="flex flex-col space-y-4">
            <Link to="/dashboard" className="text-white hover:text-red-600" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            
            <Link to="/movies" className="text-white hover:text-red-600" onClick={() => setIsOpen(false)}>
              Movies
            </Link>
            
            <Link to="/tv" className="text-white hover:text-red-600" onClick={() => setIsOpen(false)}>
              TV Shows
            </Link>
            
            <Link to="/watchlist" className="text-white hover:text-red-600" onClick={() => setIsOpen(false)}>
              Watchlist
            </Link>
            
            {/* ADD THIS - Mobile Ratings Link */}
            <Link to="/ratings" className="flex items-center text-white hover:text-red-600" onClick={() => setIsOpen(false)}>
              <Star className="w-4 h-4 mr-2" />
              My Ratings
            </Link>
            
            <Link to="/ai-suggestions" className="text-white hover:text-red-600" onClick={() => setIsOpen(false)}>
              AI Suggestions
            </Link>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search movies & TV..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
              </button>
            </form>

            <div className="pt-2 border-t border-gray-700">
              <Link to="/profile" className="block text-white hover:text-red-600 mb-2" onClick={() => setIsOpen(false)}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-white hover:text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;