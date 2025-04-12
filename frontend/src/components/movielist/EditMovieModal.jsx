import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "./editmoviemodal.scss";

const EditMovieModal = ({ movie, open, handleClose, handleSave }) => {
  const [editedMovie, setEditedMovie] = useState(null);

  useEffect(() => {
    if (movie) {
      setEditedMovie(movie);
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedMovie) {
      handleSave(editedMovie);
    }
    handleClose();
  };

  if (!editedMovie) return null;

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-movie-modal">
      <Box className="edit-movie-modal">
        <Typography id="edit-movie-modal" variant="h6" component="h2">
          Modifier le film
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Titre"
            name="title"
            value={editedMovie.title || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={editedMovie.description || ""}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="URL YouTube"
            name="url"
            value={editedMovie.url || ""}
            onChange={handleChange}
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

export default EditMovieModal;
