import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Box,
} from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline"; // import EditIcon from "@mui/icons-material/Edit";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import MovieDetails from "./MovieDetails";
import EditMovieModal from "./EditMovieModal";
import DeleteMovieModal from "./DeleteMovieModal";
import { getAllVideos, updateVideo, deleteVideo } from "../../api/video";
import { useNotification } from "../../hooks";

import "./movielist.scss";

// Helper function to extract YouTube video ID
const getYouTubeId = (url) => {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { updateNotification } = useNotification();

  const fetchMovies = async () => {
    try {
      setIsLoading(true);
      const data = await getAllVideos();
      setMovies(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      updateNotification("error", error.message);
    }
  };

  useEffect(() => {
    // TODO: Fetch movies from your API

    fetchMovies();
    // using dummy data temporarily
    // setMovies([
    //   { id: 1, title: 'Inception', description:"Inception is an upcoming American science fiction film", url:"https://www.youtube.com/watch?v=8hP9D6kZseM" },
    //   { id: 2, title: 'The Matrix', description:"Matrix is an upcoming American science fiction film", url:"https://www.youtube.com/watch?v=m8e-FF8MsqU"},
    //   { id: 3, title: 'Interstellar', description:"Interstellar is an upcoming American science fiction film", url:"https://www.youtube.com/watch?v=3WzHXI5HizQ"},
    // ]);
  }, []);

  const handleOpenModal = (movie) => {
    setSelectedMovie({ ...movie, videoId: getYouTubeId(movie.url) });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleOpenEditModal = (movie) => {
    setSelectedMovie(movie);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedMovie(null);
  };

  const handleSaveEdit = async (editedMovie) => {
    try {
      // Send update to API
      const updatedMovie = await updateVideo(editedMovie._id, editedMovie);

      // Close the edit modal
      handleCloseEditModal();
      // Update local state
      setMovies(
        movies.map((movie) =>
          movie._id === updatedMovie._id ? updatedMovie : movie
        )
      );
      // Refresh
      fetchMovies();
      updateNotification("success", "Movie updated successfully");
    } catch (error) {
      updateNotification("error", "Failed to update movie. Please try again.");
    }
  };

  const handleOpenDeleteModal = (movie) => {
    setSelectedMovie(movie);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = async () => {
    setOpenDeleteModal(false);
  };

  const handleDelete = async (movieToDelete) => {
    if (!movieToDelete || !movieToDelete._id) {
      console.error("Invalid movie object for deletion");
      updateNotification("error", "Failed to delete movie: Invalid movie data");
      return;
    }

    try {
      // Send delete request to API
      await deleteVideo(movieToDelete._id);

      // Update local state immediately for better UX
      setMovies(movies.filter((movie) => movie._id !== movieToDelete._id));

      // Close the delete modal
      handleCloseDeleteModal();

      // Show success notification
      updateNotification("success", "Movie deleted successfully");

      // Refresh the movie list to ensure sync with backend
      await fetchMovies();
    } catch (error) {
      console.error("Error deleting movie:", error);
      updateNotification(
        "error",
        `Failed to delete movie: ${error.message || "Please try again."}`
      );
    }
  };

  return (
    <div className="movie-list">
      <h2>Movie List</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Thumbnail</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => {
              const videoId = getYouTubeId(movie.url);
              const thumbnailUrl = videoId
                ? `https://img.youtube.com/vi/${videoId}/default.jpg`
                : null;

              return (
                <TableRow key={movie._id}>
                  <TableCell>{movie.title}</TableCell>
                  <TableCell>
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={`${movie.title} thumbnail`}
                        style={{ width: "120px", height: "90px" }}
                      />
                    ) : (
                      "No thumbnail available"
                    )}
                  </TableCell>
                  <TableCell>{movie.description}</TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        gap: 1,
                      }}
                    >
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => handleOpenModal(movie)}
                        aria-label="details"
                      >
                        <PlayCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        color="warning"
                        size="small"
                        onClick={() => handleOpenEditModal(movie)}
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleOpenDeleteModal(movie)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <MovieDetails
        movie={selectedMovie}
        open={openModal}
        handleClose={handleCloseModal}
      />
      <EditMovieModal
        movie={selectedMovie}
        open={openEditModal}
        handleClose={handleCloseEditModal}
        handleSave={handleSaveEdit}
      />
      <DeleteMovieModal
        movie={selectedMovie}
        open={openDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleDelete={() => selectedMovie && handleDelete(selectedMovie)}
      />
    </div>
  );
};

export default MovieList;
