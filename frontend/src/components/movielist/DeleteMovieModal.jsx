import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "./deletemoviemodal.scss";

const DeleteMovieModal = ({ movie, open, handleClose, handleDelete }) => {
  if (!movie) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="delete-movie-modal"
    >
      <Box className="delete-movie-modal">
        <Typography id="delete-movie-modal" variant="h6" component="h2">
          Confirmer la suppression
        </Typography>
        <Typography variant="body1">
          Êtes-vous sûr de vouloir supprimer le film "{movie.title}" ?
        </Typography>
        <Box className="button-group">
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDelete(movie.id)}
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

export default DeleteMovieModal;
