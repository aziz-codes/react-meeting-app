import React, { useEffect } from "react";
import { useStore } from "../context/meet-context";

const VideoPlayer = ({ stream }: { stream: MediaStream }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  return (
    <video
      ref={videoRef}
      muted
      autoPlay
      className="h-full w-full rounded-md object-cover video-mirror"
    ></video>
  );
};

export default VideoPlayer;
