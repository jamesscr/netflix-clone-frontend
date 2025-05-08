import React, { useState, createContext } from "react";
import { getAllVideos } from "../api/video";
import { useNotification } from "../hooks";

export const VideoContext = createContext();

const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);

  const { updateNotification } = useNotification();

  const fetchVideos = async () => {
    const { error, videos } = await getAllVideos();
    if (error) updateNotification("error", error);
    setVideos([...videos]);
  };

  return (
    <VideoContext.Provider
      value={{
        videos,
        fetchVideos,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoProvider;
