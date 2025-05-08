import {
  ArrowBackIosOutlined,
  ArrowForwardIosOutlined,
} from "@mui/icons-material";
import { useRef, useState, useEffect } from "react";
import ListItem from "../listItem/ListItem";
import { getAllVideos } from "../../api/video";
import "./list.scss";

export default function List() {
  const [isMoved, setIsMoved] = useState(false);
  const [slideNumber, setSlideNumber] = useState(0);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const listRef = useRef();

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setIsLoading(true);
        const data = await getAllVideos();
        setVideos(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching videos:", error);
        setError("Failed to fetch videos. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  const handleClick = (direction) => {
    setIsMoved(true);
    let distance = listRef.current.getBoundingClientRect().x - 50;
    if (direction === "left" && slideNumber > 0) {
      setSlideNumber(slideNumber - 1);
      listRef.current.style.transform = `translateX(${230 + distance}px)`;
    }
    if (direction === "right" && slideNumber < videos?.length - 1) {
      setSlideNumber(slideNumber + 1);
      listRef.current.style.transform = `translateX(${-230 + distance}px)`;
    }
  };

  if (isLoading) return <div>Loading videos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="list">
      <span className="listTitle">Continue to watch</span>
      <div className="wrapper">
        <ArrowBackIosOutlined
          className="sliderArrow left"
          onClick={() => handleClick("left")}
          style={{ display: !isMoved && "none" }}
        />
        <div className="container" ref={listRef}>
          {videos.map((video, index) => (
            <ListItem key={video._id} index={index} video={video} />
          ))}
        </div>
        <ArrowForwardIosOutlined
          className="sliderArrow right"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
}
