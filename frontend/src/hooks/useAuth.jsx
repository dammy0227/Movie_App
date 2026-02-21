import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const useAuth = (redirectTo = "/login") => {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate(redirectTo);
    }
  }, [token, navigate, redirectTo]);

  return {
    user,
    isAuthenticated: !!token,
  };
};

export const useGuest = (redirectTo = "/dashboard") => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate(redirectTo);
    }
  }, [token, navigate, redirectTo]);
};
