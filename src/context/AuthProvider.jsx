import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIsAuth, signInUser } from "../api/auth";
import { useNotification } from "../hooks";

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: true, // Indicates whether the authentication process is in progress
  error: "",
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });
  const { updateNotification } = useNotification();

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });
    const { error, user } = await signInUser({ email, password });

    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    if (!user || !user.token) {
      const errorMessage = "Login failed. Please try again.";
      updateNotification("error", errorMessage);
      return setAuthInfo({
        ...authInfo,
        isPending: false,
        error: errorMessage,
      });
    }

    navigate("/", { replace: true });
    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });
    localStorage.setItem("auth-token", user.token);
  };

  const isAuth = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setAuthInfo({ ...defaultAuthInfo, isPending: false });
      return;
    }

    try {
      const { error, user } = await getIsAuth(token);
      if (error) {
        updateNotification("error", error);
        setAuthInfo({ ...defaultAuthInfo, isPending: false, error });
      } else {
        setAuthInfo({
          profile: { ...user },
          isLoggedIn: true,
          isPending: false,
          error: "",
        });
      }
    } catch (error) {
      setAuthInfo({
        ...defaultAuthInfo,
        isPending: false,
        error: "An unexpected error occurred",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
  };

  const resetAuthState = () => {
    setAuthInfo({
      profile: null,
      isLoggedIn: false,
      isPending: false,
      error: "",
    });
  };

  useEffect(() => {
    isAuth();
  }, []);

  const isAdmin = authInfo.profile?.role === "admin";
  const token = authInfo.profile?.token || localStorage.getItem("auth-token");

  //  handleLogout
  return (
    <AuthContext.Provider
      value={{
        authInfo,
        handleLogin,
        handleLogout,
        isAuth,
        resetAuthState,
        isAdmin,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
