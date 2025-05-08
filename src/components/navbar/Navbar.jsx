import { ArrowDropDown, Notifications, Search } from "@mui/icons-material";
import { useState, useCallback, useEffect, useRef } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import ChangePasswordModal from "../modals/usermodals/changepassword/ChangePasswordModal";
import DeleteAccountModal from "../modals/usermodals/deleteaccount/DeleteAccountModal";
import { updatePassword, deleteAccount } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { validatePassword } from "../modals/usermodals/changepassword/ChangePasswordModal";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const dropdownRef = useRef(null);

  const { authInfo, handleLogout, resetAuthState } = useAuth();
  const { updateNotification } = useNotification();
  const { isLoggedIn, profile } = authInfo;
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true);
    return () => (window.onscroll = null);
  };

  const handleLogoutClick = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      const logoutPromise = handleLogout();
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Logout timeout")), 5000)
      );

      await Promise.race([logoutPromise, timeoutPromise]);
      navigate("/", { replace: true });
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      updateNotification("error", "Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [handleLogout, navigate, updateNotification]);

  const handleOpenChangePasswordModal = () => {
    setShowDropdown(false);
    setOpenChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setOpenChangePasswordModal(false);
    setPasswordError("");
  };

  const handleOpenDeleteAccountModal = () => {
    setShowDropdown(false);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteAccountModal = () => {
    setOpenDeleteModal(false);
  };

  const handleChangePassword = async (passwordData) => {
    setPasswordError("");

    const validationResult = validatePassword(passwordData);
    if (!validationResult.isValid) {
      setPasswordError(validationResult.error);
      return;
    }

    try {
      await updatePassword(
        profile.email,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setShowDropdown(false);
      handleCloseChangePasswordModal();
      updateNotification("success", "Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      setPasswordError("Failed to update password. Please try again.");
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      await deleteAccount(password);
      handleCloseDeleteAccountModal();

      setIsLoggingOut(false);
      setShowDropdown(false);
      setOpenChangePasswordModal(false);
      setOpenDeleteModal(false);

      await handleLogout();
      localStorage.removeItem("auth-token");
      resetAuthState();

      navigate("/login", { replace: true });
      updateNotification("success", "Account deleted successfully");
    } catch (error) {
      console.error("Error deleting user account:", error);
      updateNotification(
        "error",
        "Failed to delete account. Please try again."
      );
    }
  };

  return (
    <div className={isScrolled ? "navbar scrolled" : "navbar"}>
      <div className="container">
        <div className="left">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/2560px-Netflix_2015_logo.svg.png"
            alt=""
          />
        </div>
        <div className="right">
          <div className="profile">
            <img
              src="https://images.pexels.com/photos/6899260/pexels-photo-6899260.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="dropdown" ref={dropdownRef}>
                <Link className="dropdown-item">
                  <span onClick={handleOpenChangePasswordModal}>
                    Change Password
                  </span>
                </Link>
                <Link className="dropdown-item">
                  <span onClick={handleOpenDeleteAccountModal}>
                    Delete Account
                  </span>
                </Link>
                {profile?.role === "admin" && (
                  <Link to="/admin" className="dropdown-item">
                    Dashboard
                  </Link>
                )}
              </div>
            )}
          </div>
          {isLoggedIn ? (
            <button
              className={`navbutton ${isLoggingOut ? "loading" : ""}`}
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link to="/login" className="navlink">
              Login
            </Link>
          )}
        </div>
      </div>
      <ChangePasswordModal
        user={profile}
        open={openChangePasswordModal}
        handleClose={handleCloseChangePasswordModal}
        handleSave={handleChangePassword}
        error={passwordError}
      />
      <DeleteAccountModal
        user={profile}
        open={openDeleteModal}
        handleClose={handleCloseDeleteAccountModal}
        handleDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default Navbar;
