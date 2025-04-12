import React, { useState } from "react";
import { Modal, Box, Typography, Button, TextField } from "@mui/material";
import "./deleteaccountmodal.scss";

const DeleteAccountModal = ({ user, open, handleClose, handleDelete }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!user) return null;

  const handleSubmit = () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }
    handleDelete(password);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-user-modal useremail"
    >
      <Box className="delete-user-modal">
        <Typography id="delete-user-modal" variant="h6" component="h2">
          Confirmer la suppression
        </Typography>
        <Typography variant="body2" component="p" className="useremail">
          Êtes-vous sûr de vouloir supprimer votre compte?
          <br />
          {user.email}
        </Typography>
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={!!error}
          helperText={error}
        />
        <Box className="button-group">
          <Button variant="contained" color="error" onClick={handleSubmit}>
            Supprimer
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Annuler
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteAccountModal;
