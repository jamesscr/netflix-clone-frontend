import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Admin from "./pages/admin/Admin";
import { useAuth } from "./hooks";

const ProtectedRoute = ({ children, isAllowed, redirectTo = "/login" }) => {
  return isAllowed ? children : <Navigate to={redirectTo} replace />;
};

const App = () => {
  const { authInfo } = useAuth();
  const { isLoggedIn, isPending, profile } = authInfo; // Assume profile is an object with a role property
  const isAdmin = profile?.role === "admin";

  //no routing decisions are made until authentication is complete.
  if (isPending) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute isAllowed={isLoggedIn} redirectTo="/login">
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute isAllowed={isLoggedIn && isAdmin} redirectTo="/">
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? "/" : "/login"} replace />}
      />
    </Routes>
  );
};

export default App;
