import React from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import "./addvideomodal.scss";

const AddVideoModal = ({ open, handleClose }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-video-modal"
      aria-describedby="modal-to-add-new-video"
      className="add-video-modal"
    >
      <Box className="modal-content">
        <Typography
          id="add-video-modal"
          variant="h6"
          component="h2"
          className="modal-title"
        >
          Add New Video
        </Typography>
        <Box component="form" onSubmit={handleSubmit} className="modal-form">
          <TextField
            fullWidth
            label="Video Title"
            variant="outlined"
            margin="normal"
            required
            className="form-field"
          />
          <TextField
            fullWidth
            label="Video URL"
            variant="outlined"
            margin="normal"
            required
            className="form-field"
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            className="form-field"
          />
          <div className="submit-button-container">
            <Button type="submit" variant="contained" className="submit-button">
              Add Video
            </Button>
          </div>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddVideoModal;
