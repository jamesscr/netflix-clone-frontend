import React from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "./moviedetails.scss";

const MovieDetails = ({ movie, open, handleClose }) => {
  if (!movie) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="movie-details-modal"
      aria-describedby="movie-details-description"
    >
      <Box className="movie-details-modal">
        <Typography id="movie-details-modal" variant="h6" component="h2">
          {movie.title}
        </Typography>
        <Box className="movie-details-content">
          <Box className="video-container">
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${movie.videoId}`}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </Box>
          <Typography id="movie-details-description" sx={{ mt: 2 }}>
            {movie.description}
          </Typography>
        </Box>
        <Button onClick={handleClose}>Fermer</Button>
      </Box>
    </Modal>
  );
};

export default MovieDetails;
