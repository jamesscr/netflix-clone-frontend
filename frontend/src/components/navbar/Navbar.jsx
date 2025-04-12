import { ArrowDropDown, Notifications, Search } from "@mui/icons-material";
import { useState, useCallback, useEffect, useRef } from "react";
import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import ChangePasswordModal from "../modals/usermodals/changepassword/ChangePasswordModal";
import DeleteAccountModal from "../modals/usermodals/deleteaccount/DeleteAccountModal";
import { updatePassword, deleteAccount } from "../../api/auth";
import { useAuth } from "../../hooks";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedUser, setSelectedUser] = useState();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const dropdownRef = useRef(null);

  const { authInfo, handleLogout, resetAuthState } = useAuth();
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
      // Optionally, you can show an error message to the user here
    } finally {
      setIsLoggingOut(false);
    }
  }, [handleLogout, navigate]);

  const handleOpenChangePasswordModal = () => {
    setShowDropdown(false);
    setOpenChangePasswordModal(true);
  };

  const handleCloseChangePasswordModal = () => {
    setOpenChangePasswordModal(false);
  };

  const handleOpenDeleteAccountModal = () => {
    setShowDropdown(false);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteAccountModal = () => {
    setOpenDeleteModal(false);
  };

  const handleChangePassword = async (passwordData) => {
    try {
      // Call API to update the user's password
      await updatePassword(
        profile.email,
        passwordData.currentPassword,
        passwordData.newPassword
      );

      setShowDropdown(false);
      handleCloseChangePasswordModal();
      // Optionally, you can show a success message to the user here
    } catch (error) {
      console.error("Error updating password:", error);
      // Handle the error (e.g., display an error message to the user)
    }
  };

  const handleDeleteAccount = async (password) => {
    try {
      await deleteAccount(password);
      handleCloseDeleteAccountModal();

      // Reset all relevant states
      setIsLoggingOut(false);
      setShowDropdown(false);
      setModalOpen(false);
      setOpenChangePasswordModal(false);
      setOpenDeleteModal(false);

      // Perform logout
      await handleLogout();

      // Clear any stored auth data (if not already done in handleLogout)
      localStorage.removeItem("auth-token"); // Adjust this based on how you store auth data

      // Reset auth state explicitly
      // You might need to add a function to your useAuth hook to do this
      resetAuthState();

      // Navigate to login page
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Error deleting user account:", error);
      // Display error message to the user
    }
  };

  const handleModalOpen = () => setModalOpen(true);
  const handleModalClose = () => setModalOpen(false);

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
      />
      <DeleteAccountModal
        user={profile}
        open={openDeleteModal}
        handleClose={handleCloseDeleteAccountModal}
        handleDelete={handleDeleteAccount}
      />
      {/* <AddVideoModal open={modalOpen} handleClose={handleModalClose} /> */}
    </div>
  );
};

export default Navbar;
