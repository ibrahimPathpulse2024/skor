"use client";
import React, { useState, useEffect, useRef } from "react";

type MapIdentifierProps = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

const MapIdentifier: React.FC<MapIdentifierProps> = ({ videoRef }) => {
  const [predictedMap, setPredictedMap] = useState("Detecting...");
  // Create an offscreen canvas for capturing video frames.
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));

  useEffect(() => {
    let intervalId: number;
    if (videoRef.current) {
      intervalId = window.setInterval(async () => {
        const video = videoRef.current;
        if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
          console.warn("Video not ready for map prediction.");
          return;
        }
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // Convert the canvas image to a base64-encoded JPEG.
        const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
        // Remove the prefix ("data:image/jpeg;base64,") from the data URL.
        const base64Data = dataUrl.split(",")[1];

        try {
          // Call your FastAPI endpoint running on localhost:8000.
          const response = await fetch("https://staging.skoragents.ai/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: base64Data }),
          });
          if (response.ok) {
            const result = await response.json();
            // Expecting a JSON response with a "map" property.
            setPredictedMap(result.map || "Unknown");
          } else {
            console.error("Prediction API error:", response.status);
          }
        } catch (error) {
          console.error("Error calling prediction API:", error);
        }
      }, 3000); // Run prediction every 3 seconds.
    }
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [videoRef]);

  return (
    <div className="map-identifier">
      <h4>Current Map: {predictedMap}</h4>
    </div>
  );
};

export default MapIdentifier;
