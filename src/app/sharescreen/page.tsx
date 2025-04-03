"use client";
import cn from "classnames";
import { useRef, useState } from "react";
import { Altair } from "../../components/altair/Altair";
import ControlTray from "../../components/control-tray/ControlTray";
import SidePanel from "../../components/sidepanel/sidepanel";
import MobileRestriction from "../../components/ui/MobileRestriction";
import { LiveAPIProvider } from "../../contexts/LiveAPIContext";
import "./App.scss";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set NEXT_PUBLIC_GEMINI_API_KEY in .env");
}
const host = "generativelanguage.googleapis.com";
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`;

function App() {
  // this video reference is used for displaying the active stream, whether that is the webcam or screen capture
  // feel free to style as you see fit
  const videoRef = useRef<HTMLVideoElement>(null);
  // either the screen capture, the video or null, if null we hide it
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const bgdiv = {
    backgroundImage: 'url("/image.svg")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  };

  return (
    <MobileRestriction>
      <div className="App" style={bgdiv}>
        <LiveAPIProvider url={uri} apiKey={API_KEY}>
          <div className="streaming-console">
            <SidePanel />

            <main>
              <div className="main-app-area">
                {/* APP goes here */}

                <Altair />
                <video
                  className={cn("stream", {
                    hidden: !videoRef.current || !videoStream,
                  })}
                  ref={videoRef}
                  autoPlay
                  playsInline
                />
              </div>

              <ControlTray
                videoRef={videoRef}
                supportsVideo={true}
                onVideoStreamChange={setVideoStream}
              >
                {/* put your own buttons here */}
              </ControlTray>
            </main>
          </div>
        </LiveAPIProvider>
      </div>
    </MobileRestriction>
  );
}

export default App;
