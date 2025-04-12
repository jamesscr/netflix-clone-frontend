import { useState, useRef } from "react";
import "./listItem.scss";
import {
  PlayArrow,
  Add,
  ThumbUpAltOutlined,
  ThumbDownOutlined,
} from "@mui/icons-material";
import PlayModal from "../modals/videomodals/playvideomodal/PlayVideoModal";
import { getYouTubeId } from "../../utils/helper";

export default function ListItem({ index, video }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoId = getYouTubeId(video.url);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/default.jpg`
    : null;

  const handlePlayVideo = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div
      className={`listItem ${isHovered ? "hovered" : ""}`}
      style={{
        transform: isHovered ? "scale(1.2) translateY(-20px)" : "scale(1)",
        zIndex: isHovered ? 99 : "auto",
        transition: "all 0.3s ease-in-out",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={video.imgSrc || thumbnailUrl} alt={video.title} />
      {isHovered && (
        <div className="itemInfo">
          <div className="icons">
            <PlayArrow className="icon" onClick={handlePlayVideo} />
            <Add className="icon" />
            <ThumbUpAltOutlined className="icon" />
            <ThumbDownOutlined className="icon" />
          </div>
          <div className="itemInfoTop">
            <span>{video.duration || "1h 14m"}</span>
            <span className="limit">+{video.ageLimit || "16"}</span>
            <span>{video.year || "2023"}</span>
          </div>
          <div className="desc">{video.description}</div>
          <div className="genre">{video.genre || "Action"}</div>
        </div>
      )}
      <PlayModal
        open={isModalOpen}
        handleClose={handleCloseModal}
        movie={video}
      />
    </div>
  );
}
