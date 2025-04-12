import { useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { VideoContext } from "../context/VideoProvider";
import { NotificationContext } from "../context/NotificationProvider";

export const useNotification = () => useContext(NotificationContext);
export const useAuth = () => useContext(AuthContext);
export const useVideos = () => useContext(VideoContext);
