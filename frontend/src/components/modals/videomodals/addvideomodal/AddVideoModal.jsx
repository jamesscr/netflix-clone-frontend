import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { addMovie } from "../../../../api/video";
import { useNotification } from "../../../../hooks";
import "./addvideomodal.scss";

const AddVideoModal = ({ open, handleClose }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const { updateNotification } = useNotification();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await addMovie({ title, url, description });
      handleClose();
      setTitle("");
      setUrl("");
      setDescription("");
      updateNotification("success", "Video added successfully");
    } catch (error) {
      updateNotification("error", error.message);
    }
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            fullWidth
            label="Video URL"
            variant="outlined"
            margin="normal"
            required
            className="form-field"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            className="form-field"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
