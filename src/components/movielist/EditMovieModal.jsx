import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "./editmoviemodal.scss";

const EditMovieModal = ({ movie, open, handleClose, handleSave }) => {
  const [editedMovie, setEditedMovie] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (movie) {
      setEditedMovie(movie);
    }
  }, [movie]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedMovie((prev) => ({ ...prev, [name]: value }));
  };

  const validateMovieInfo = (movieInfo) => {
    const { title, description, url } = movieInfo;

    if (!title.trim()) return { ok: false, error: "Title is missing!" };
    if (title.length < 3)
      return { ok: false, error: "Title must be at least 3 characters long!" };

    if (!description.trim())
      return { ok: false, error: "Description is missing!" };
    if (description.length < 10)
      return {
        ok: false,
        error: "Description must be at least 10 characters long!",
      };

    if (!url.trim()) return { ok: false, error: "YouTube URL is missing!" };
    if (!url.includes("youtube.com") && !url.includes("youtu.be"))
      return { ok: false, error: "Invalid YouTube URL!" };

    return { ok: true };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedMovie) {
      const validationResult = validateMovieInfo(editedMovie);
      if (!validationResult.ok) {
        setError(validationResult.error);
        return;
      }
      handleSave(editedMovie);
      handleClose();
      setError("");
    }
  };

  if (!editedMovie) return null;

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="edit-movie-modal">
      <Box className="edit-movie-modal">
        <Typography id="edit-movie-modal" variant="h6" component="h2">
          Modifier le film
        </Typography>
        <form onSubmit={handleSubmit}>
          {error && (
            <Typography
              color="error"
              variant="body1"
              style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#ffebee",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              {error}
            </Typography>
          )}
          <TextField
            fullWidth
            margin="normal"
            label="Titre"
            name="title"
            value={editedMovie.title}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={editedMovie.description}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="URL YouTube"
            name="url"
            value={editedMovie.url}
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
