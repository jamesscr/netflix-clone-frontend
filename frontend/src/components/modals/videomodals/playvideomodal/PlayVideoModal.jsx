import React, { useState, useEffect } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import "./playvideomodal.scss";

const PlayVideoModal = ({ open, handleClose, movie }) => {
  const [embedUrl, setEmbedUrl] = useState(null);

  const videoUrl = movie?.url;

  useEffect(() => {
    if (open && movie?.url) {
      const videoId = movie.url.split("v=")[1];
      setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
    }
  }, [open, movie]);

  if (!open || !movie) return null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="play-modal-title"
      aria-describedby="play-modal-description"
    >
      <Box className="play-modal">
        <Typography id="play-modal-title" variant="h6" component="h2">
          Now Playing: {movie?.title || "Loading..."}
        </Typography>
        <Box
          sx={{
            mt: 2,
            mb: 2,
            width: "100%",
            height: "0",
            paddingBottom: "56.25%",
            position: "relative",
          }}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={movie.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
              }}
              onError={(e) => console.error("Error loading video:", e)}
            ></iframe>
          ) : (
            <Typography>
              {movie
                ? `Video URL not available for: ${movie.title}`
                : "Video data not loaded"}
            </Typography>
          )}
        </Box>
        <Button onClick={handleClose}>Close</Button>
      </Box>
    </Modal>
  );
};

export default PlayVideoModal;
