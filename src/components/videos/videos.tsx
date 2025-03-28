import React, { useState, useEffect, useRef } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import cn from "classnames"; 
import "../videos/videos.scss";

const VideoUpload: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
    const [buttonState, setButtonState] = useState(false);
  const connectButtonRef = useRef<HTMLButtonElement>(null);

  const toggleConnectButton = () => {
    setIsConnecting((prev) => !prev);
  };

  const { client, connected, connect, disconnect, volume } =
    useLiveAPIContext();

  useEffect(() => {
    if (!connected && connectButtonRef.current) {
      connectButtonRef.current.focus();
    }
  }, [connected]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--volume",
      `${Math.max(5, Math.min(volume * 200, 8))}px`
    );
  }, [volume]);

  return (
    <button
      ref={connectButtonRef}
      className={cn("toggle-button connect-toggle", { connected })}
      onClick={toggleConnectButton}
    >
      {connected ? "On" : "Off"}
    </button>
  );
};

export default VideoUpload;
