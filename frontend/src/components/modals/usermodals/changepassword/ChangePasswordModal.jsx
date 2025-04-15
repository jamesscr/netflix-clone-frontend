import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "./changepasswordmodal.scss";

const ChangePasswordModal = ({
  user,
  open,
  handleClose,
  handleSave,
  error: externalError,
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [internalError, setInternalError] = useState("");

  useEffect(() => {
    if (user) {
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
      setInternalError("");
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setInternalError(""); // Clear internal error on input change
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationResult = validatePassword(passwordData);
    if (!validationResult.isValid) {
      setInternalError(validationResult.error);
    } else {
      handleSave(passwordData);
    }
  };

  if (!user) return null;

  const displayError = internalError || externalError;

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
          {displayError && (
            <Typography
              color="error"
              variant="body2"
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              {displayError}
            </Typography>
          )}
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
          />
          <TextField
            fullWidth
            margin="normal"
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Confirm New Password"
            name="confirmNewPassword"
            type="password"
            value={passwordData.confirmNewPassword}
            onChange={handleChange}
          />
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

export const validatePassword = (passwordData) => {
  const { currentPassword, newPassword, confirmNewPassword } = passwordData;

  if (!currentPassword.trim()) {
    return { isValid: false, error: "Current password is required" };
  }

  if (!newPassword.trim()) {
    return { isValid: false, error: "New password is required" };
  }

  if (newPassword.length < 8) {
    return {
      isValid: false,
      error: "New password must be at least 8 characters long",
    };
  }

  if (!confirmNewPassword.trim()) {
    return { isValid: false, error: "Please confirm your new password" };
  }

  if (newPassword !== confirmNewPassword) {
    return { isValid: false, error: "New passwords do not match" };
  }

  if (currentPassword === newPassword) {
    return {
      isValid: false,
      error: "New password must be different from the current password",
    };
  }

  return { isValid: true, error: "" };
};

export default ChangePasswordModal;
