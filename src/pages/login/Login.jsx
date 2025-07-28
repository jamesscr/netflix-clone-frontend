import React, { useEffect, useState } from "react";
import { useAuth, useNotification } from "../../hooks";
import { Link, useNavigate } from "react-router-dom";
import backgroundImage from "../../assets/images/metflix_login_bg.jpg";

import "./login.scss";

const isValidEmail = (email) => {
  const isValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  return isValid.test(email);
};

const validateUserInfo = ({ email, password }) => {
  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be 8 characters long!" };

  return { ok: true };
};

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { handleLogin, authInfo, resetAuthState } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (isLoggedIn) {
        navigate("/");
      } else {
        await resetAuthState();
      }
      setAuthChecked(true);
    };

    checkAuthAndRedirect();
  }, []); // Empty dependency array means this effect runs once on mount

  const handleChange = ({ target }) => {
    const { value, name } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (isLoggedIn) {
      // If the user is already logged in, just redirect them
      navigate("/");
      return;
    }

    const { ok, error: validationError } = validateUserInfo(userInfo);

    if (!ok) {
      // setError(validationError);
      updateNotification("error", validationError);
      return;
    }

    try {
      setIsLoading(true);
      const result = await handleLogin(userInfo.email, userInfo.password);
    } catch (loginError) {
      setError("An unexpected error occurred. Please try again.");
      updateNotification(
        "error",
        "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authInfo.error) {
      setError(authInfo.error);
    }
  }, [authInfo.error]);

  useEffect(() => {
    // we want to move our user to somewhere else
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  if (!authChecked) {
    return <div>Loading...</div>; // Or some loading spinner
  }

  return (
    <div
      className="login"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="top">
        <div className="wrapper">
          <img className="logo" src="/metflix.png" alt="" />
        </div>
      </div>
      <div className="container">
        <div className="form-wrapper">
          <h1>Sign In</h1>
          {/* {error && <div className="error-message">{error}</div>} */}
          <form onSubmit={handleSubmit}>
            <input
              name="email"
              type="email"
              placeholder="Email or phone number"
              value={userInfo.email}
              onChange={handleChange}
              autoComplete="new-email"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={userInfo.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button type="submit" className="loginButton" disabled={isPending}>
              {isPending ? "Loading..." : "Sign In"}
            </button>
          </form>
          <div className="register-link">
            New to Metflix? <Link to="/register">Sign up now.</Link>
          </div>
          {/* <small>
            This page is protected by Google reCAPTCHA to ensure you're not a
            bot. <b>Learn more</b>.
          </small> */}
        </div>
      </div>
    </div>
  );
}
