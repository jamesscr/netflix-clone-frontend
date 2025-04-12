import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "./changepasswordmodal.scss";
import { useAuth, useNotification } from "../../../../hooks";

const ChangePasswordModal = ({ user, open, handleClose, handleSave }) => {
  const { updateNotification } = useNotification();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePassword = () => {
    if (passwordData.newPassword.length < 8) {
      const errorMessage = "New password must be at least 8 characters long";
      setError(errorMessage);
      updateNotification("error", errorMessage);
      return false;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      const errorMessage = "New passwords do not match";
      setError(errorMessage);
      updateNotification("error", errorMessage);
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validatePassword()) {
      try {
        await handleSave({
          email: user.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        handleClose();
        updateNotification("success", "Password updated successfully");
      } catch (error) {
        updateNotification(
          "error",
          "Failed to update password. Please try again."
        );
      }
    }
  };

  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="change-password-modal"
    >
      <Box className="edit-user-modal">
        <Typography id="change-password-modal" variant="h6" component="h2">
          Change Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={user.email || ""}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Current Password"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            value={passwordData.confirmNewPassword}
            onChange={handleChange}
            required
          />
          {error && <Typography color="error">{error}</Typography>}
          <Box className="button-group">
            <Button type="submit" variant="contained" color="primary">
              Save
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default ChangePasswordModal;
