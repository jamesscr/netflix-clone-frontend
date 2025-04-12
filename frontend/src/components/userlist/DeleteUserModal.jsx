import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "./deleteusermodal.scss";

const DeleteUserModal = ({ user, open, handleClose, handleDelete }) => {
  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-user-modal"
    >
      <Box className="delete-user-modal">
        <Typography id="delete-user-modal" variant="h6" component="h2">
          Confirmer la suppression
        </Typography>
        <Typography variant="body1">
          Êtes-vous sûr de vouloir supprimer l'utilisateur avec l'email "
          {user.email}" ?
        </Typography>
        <Box className="button-group">
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(user._id)}
          >
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

export default DeleteUserModal;
