import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { googleLogin } from "../features/auth/authSlice";
import { auth, googleProvider } from "../config/firebase";
import { signInWithPopup } from "firebase/auth";

const GoogleButton = ({ text = "Sign in with Google" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {

      const result = await signInWithPopup(auth, googleProvider);
      
      const idToken = await result.user.getIdToken();
      
      const response = await dispatch(googleLogin(idToken));
      
      if (response.meta.requestStatus === 'fulfilled') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="w-full py-3 bg-white text-gray-900 font-semibold rounded hover:bg-gray-100 transition flex items-center justify-center gap-2 border border-gray-300"
    >
      <FcGoogle className="text-2xl" />
      {text}
    </button>
  );
};

export default GoogleButton;