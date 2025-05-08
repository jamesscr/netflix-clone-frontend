import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import "./editusermodal.scss";

const EditUserModal = ({ user, open, handleClose, handleSave }) => {
  const [editedUser, setEditedUser] = useState(null);

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: name === "isVerified" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedUser) {
      handleSave(editedUser);
    }
    handleClose();
  };

  if (!editedUser) return null;

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-user-modal">
      <Box className="edit-user-modal">
        <Typography id="edit-user-modal" variant="h6" component="h2">
          Modifier l'utilisateur
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            value={editedUser.email || ""}
            onChange={handleChange}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={editedUser.isVerified}
                onChange={handleChange}
                name="isVerified"
              />
            }
            label="Vérifié"
          />
          <Box className="button-group">
            <Button type="submit" variant="contained" color="primary">
              Sauvegarder
            </Button>
            <Button variant="contained" color="secondary" onClick={handleClose}>
              Annuler
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
