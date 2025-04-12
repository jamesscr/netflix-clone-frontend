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
} from "@mui/material";

import MovieDetails from "./MovieDetails";
import EditMovieModal from "./EditMovieModal";
import DeleteMovieModal from "./DeleteMovieModal";
import { getAllVideos } from "../../api/video";
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

  useEffect(() => {
    // TODO: Fetch movies from your API
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const data = await getAllVideos();
        setMovies(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setError("Failed to fetch movies. Please try again later.");
        setIsLoading(false);
      }
    };

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
  };

  const handleSaveEdit = (editedMovie) => {
    setMovies(
      movies.map((movie) => (movie.id === editedMovie.id ? editedMovie : movie))
    );
    // TODO: Send update to API
  };
  const handleOpenDeleteModal = (movie) => {
    setSelectedMovie(movie);
    setOpenDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setOpenDeleteModal(false);
  };

  const handleDelete = (movieId) => {
    setMovies(movies.filter((movie) => movie.id !== movieId));
    handleCloseDeleteModal();
    // TODO: Send delete request to API
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
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal(movie)}
                    >
                      Details
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => handleOpenEditModal(movie)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      onClick={() => handleOpenDeleteModal(movie)}
                    >
                      Delete
                    </Button>
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
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default MovieList;
