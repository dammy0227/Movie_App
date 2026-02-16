import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import Navbar from '../components/Navbar';
import { User, Mail, Calendar, LogOut, Film, Heart } from 'lucide-react';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { watchlist, history } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">Profile</h1>

        <div className="bg-gray-900 rounded-2xl p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-800">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{watchlist?.length || 0}</div>
              <div className="text-gray-400">Watchlist</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{history?.length || 0}</div>
              <div className="text-gray-400">Movies Watched</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">
                {new Date(user?.createdAt).toLocaleDateString()}
              </div>
              <div className="text-gray-400">Member Since</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => navigate('/watchlist')}
            className="bg-gray-900 hover:bg-gray-800 rounded-xl p-6 transition group"
          >
            <Heart className="w-8 h-8 text-red-600 mb-3 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold text-white mb-2">My Watchlist</h3>
            <p className="text-gray-400">View and manage your saved movies</p>
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gray-900 hover:bg-gray-800 rounded-xl p-6 transition group"
          >
            <Film className="w-8 h-8 text-red-600 mb-3 group-hover:scale-110 transition" />
            <h3 className="text-xl font-bold text-white mb-2">Browse Movies</h3>
            <p className="text-gray-400">Discover new movies to watch</p>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition flex items-center justify-center"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Profile;