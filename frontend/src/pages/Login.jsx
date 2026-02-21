import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../features/auth/authSlice';
import GoogleButton from '../components/GoogleButton'; 
import LoadingSpinner from '../components/LoadingSpinner';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://i.pinimg.com/736x/36/d3/92/36d39247289fa60ad6c51a6d5b29f7cc.jpg"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md p-8 bg-black/80 rounded-lg backdrop-blur-sm border border-gray-800">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Welcome Back</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700 placeholder-gray-500"
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
              className="w-full px-4 py-3 bg-gray-800/50 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-gray-700 placeholder-gray-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                <span>Signing In...</span>
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black/80 text-gray-400">or continue with</span>
          </div>
        </div>

        <GoogleButton text="Sign in with Google" />

        <p className="mt-6 text-center text-gray-400">
          New to Movie Box?{' '}
          <Link to="/register" className="text-red-500 hover:text-red-400 font-semibold hover:underline transition">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;