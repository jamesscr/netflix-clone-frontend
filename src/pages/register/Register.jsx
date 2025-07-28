import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import backgroundImage from "../../assets/images/metflix_login_bg.jpg";
import "./register.scss";

const isValidEmail = (email) => {
  // Simpler email regex
  const isValid =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return isValid.test(email);
};

const validateUserInfo = ({ name, email, password }) => {
  // Allow letters, spaces, hyphens, and apostrophes in names
  const isValidName = /^[a-zA-Z\s'-]+$/;

  if (!name.trim()) return { ok: false, error: "Name is missing!" };
  if (!isValidName.test(name)) return { ok: false, error: "Invalid name!" };
  if (name.length > 50) return { ok: false, error: "Name is too long!" };

  if (!email.trim()) return { ok: false, error: "Email is missing!" };
  if (!isValidEmail(email)) return { ok: false, error: "Invalid email!" };
  if (email.length > 100) return { ok: false, error: "Email is too long!" };

  if (!password.trim()) return { ok: false, error: "Password is missing!" };
  if (password.length < 8)
    return { ok: false, error: "Password must be at least 8 characters long!" };
  if (password.length > 128)
    return { ok: false, error: "Password is too long!" };

  return { ok: true };
};

export default function Register() {
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const { updateNotification } = useNotification();

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) return updateNotification("error", error);

    const response = await createUser(userInfo);
    if (response.error) return updateNotification("error", response.error);

    navigate("/login", {
      state: { user: response.user },
      replace: true,
    });
  };

  useEffect(() => {
    // we want to move our user to somewhere else
    if (isLoggedIn) navigate("/");
  }, [isLoggedIn]);

  const { name, email, password } = userInfo;

  return (
    <div
      className="register"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="top">
        <div className="wrapper">
          <img className="logo" src="/metflix.png" alt="logo" alt="logo" />
        </div>
      </div>
      <div className="container">
        <div className="form-wrapper">
          <h1>Register</h1>
          {/* {error && <div className="error-message">{error}</div>} */}
          <form onSubmit={handleSubmit}>
            <input
              name="name"
              type="name"
              placeholder="Name"
              value={name}
              onChange={handleChange}
              autoComplete="off"
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleChange}
              autoComplete="new-email"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button type="submit" className="registerButton">
              Start Register
            </button>
          </form>
          <div className="login-link">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign In</span>
          </div>
        </div>
      </div>
    </div>
  );
}
