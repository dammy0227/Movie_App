import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { register } from '../features/auth/authSlice';
import GoogleButton from '../components/GoogleButton'; 
<<<<<<< HEAD
import LoadingSpinner from '../components/LoadingSpinner';
=======
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
    name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(register(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
<<<<<<< HEAD
          src="https://i.pinimg.com/736x/36/d3/92/36d39247289fa60ad6c51a6d5b29f7cc.jpg"
=======
            src="https://i.pinimg.com/736x/36/d3/92/36d39247289fa60ad6c51a6d5b29f7cc.jpg"
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Register Form */}
<<<<<<< HEAD
      <div className="relative z-10 w-full max-w-md p-8 bg-black/80 rounded-lg backdrop-blur-sm border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Create Account</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
=======
      <div className="relative z-10 w-full max-w-md p-8 bg-black/80 rounded">
        <h2 className="text-3xl font-bold text-white mb-8">Register</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
<<<<<<< HEAD
              className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700 placeholder-gray-500"
=======
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
              required
            />
          </div>
          
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
<<<<<<< HEAD
              className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700 placeholder-gray-500"
=======
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
              required
            />
          </div>
          
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
<<<<<<< HEAD
              className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700 placeholder-gray-500"
              required
              minLength="6"
            />
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
=======
              className="w-full px-4 py-3 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              required
              minLength="6"
            />
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
          </div>

          <button
            type="submit"
            disabled={loading}
<<<<<<< HEAD
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                <span>Creating Account...</span>
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black/80 text-gray-400">or sign up with</span>
=======
            className="w-full py-3 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        {/* ADD THIS DIVIDER AND GOOGLE BUTTON */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-black/80 text-gray-400">Or sign up with</span>
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
          </div>
        </div>

        <GoogleButton text="Sign up with Google" />

<<<<<<< HEAD
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold hover:underline transition">
            Sign in
=======
        <p className="mt-4 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:underline">
            Sign in now.
>>>>>>> 9f79863cc8a29cab049d0bdaa7f586b2f5c9eb5f
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;