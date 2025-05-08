import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  InfoOutlined,
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
} from "@mui/icons-material";
import { Button, IconButton, CircularProgress } from "@mui/material";
import "./featured.scss";
import coverImg from "../../assets/images/matrix.jpg";
import PlayModal from "../modals/videomodals/playvideomodal/PlayVideoModal";
import { getYouTubeId } from "../../utils/helper";
import { getVideoById, getAllVideos } from "../../api/video";

export default function Featured({ type }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverImage, setCoverImage] = useState(coverImg);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isImageChanging, setIsImageChanging] = useState(false);

  const videoId = movie?.url ? getYouTubeId(movie.url) : null;
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/default.jpg`
    : null;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const intervalRef = useRef(null);

  const fetchMovie = useCallback(async () => {
    try {
      setLoading(true);
      setIsImageChanging(true);

      const vids = await getAllVideos();
      const videoIds = vids.map((vid) => vid._id);
      const randomVideoId =
        videoIds[Math.floor(Math.random() * videoIds.length)];

      const data = await getVideoById(randomVideoId);
      if (data && data.video) {
        setMovie(data.video);
        const videoId = getYouTubeId(data.video.url);
        const newThumbnailUrl = videoId
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          : coverImg;
        setTimeout(() => {
          setCoverImage(newThumbnailUrl);
          setIsImageChanging(false);
        }, 300);
      } else {
        throw new Error("No video data found");
      }
    } catch (err) {
      console.error("Error fetching movie:", err);
      setMovie({
        title: "The Matrix",
        url: "https://www.youtube.com/watch?v=9ix7TUGVYIo",
        description: "The Matrix is a 1999 science fiction film...",
      });
      setCoverImage(coverImg);
    } finally {
      setLoading(false);
    }
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(fetchMovie, 15000);
  }, [fetchMovie]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    fetchMovie();
    startInterval();

    return () => stopInterval();
  }, [fetchMovie, startInterval, stopInterval]);

  useEffect(() => {
    if (isHovered || isModalOpen) {
      stopInterval();
    } else {
      startInterval();
    }
  }, [isHovered, isModalOpen, startInterval, stopInterval]);

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
    setCoverImage(coverImg);
  };

  if (error) return <div>Error: {error}</div>;
  if (!movie) return null;

  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movie" ? "Videos" : "Series"}</span>
          <select name="genre" id="genre">
            <option>Genre</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      {imageLoading && <CircularProgress />}
      <img
        src={coverImage}
        alt="cover"
        className={`featured-image ${isImageChanging ? "changing" : ""}`}
        style={{ display: imageLoading ? "none" : "block" }}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />
      <div className="info">
        <div className="buttons">
          <Button
            className="play"
            variant="contained"
            color="primary"
            size="small"
            onClick={handleOpenModal}
          >
            Play
          </Button>
          <div
            className="info-button-wrapper"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button
              className="more"
              variant="contained"
              color="primary"
              size="small"
            >
              Info
            </Button>
            {isHovered && (
              <div className="matrix-hovered-content">
                <img
                  src={coverImage || thumbnailUrl}
                  alt="Movie thumbnail"
                  className="matrix-thumbnail"
                />
                <div className="matrix-info">
                  <div className="matrix-icons">
                    <IconButton aria-label="add to list">
                      <Add className="matrix-icon" />
                    </IconButton>
                    <IconButton aria-label="like">
                      <ThumbUpAltOutlined className="matrix-icon" />
                    </IconButton>
                    <IconButton aria-label="dislike">
                      <ThumbDownOutlined className="matrix-icon" />
                    </IconButton>
                  </div>
                  <div className="matrix-title">
                    {movie?.title || "The Matrix"}
                  </div>
                  <div className="matrix-info-top">
                    <span className="duration">1h 14m</span>
                    <span className="limit">+16</span>
                    <span className="year">2023</span>
                  </div>
                  <div className="matrix-desc">
                    The Matrix is a 1999 science fiction action film written and
                    directed by the Wachowskis.[a] It is the first installment
                    in the Matrix film series, starring Keanu Reeves, Laurence
                    Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe
                    Pantoliano.
                  </div>
                  <div className="matrix-genre">Action, Sci-Fi</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <PlayModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        movie={movie}
      />
    </div>
  );
}
