import React from "react";
import AuthProvider from "./AuthProvider";
import VideoProvider from "./VideoProvider";
import NotificationProvider from "./NotificationProvider";

export default function ContextProviders({ children }) {
  return (
    <NotificationProvider>
      <VideoProvider>
        <AuthProvider>{children}</AuthProvider>
      </VideoProvider>
    </NotificationProvider>
  );
}
