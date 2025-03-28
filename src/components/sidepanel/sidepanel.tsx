import cn from "classnames";
import { useEffect, useRef, useState } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useLoggerStore } from "../../lib/store-logger";
import Logger, { LoggerFilterType } from "../logger/Logger";
import "./side-panel.scss";

const filterOptions = [
  { value: "conversations", label: "Conversations" },
  { value: "tools", label: "Tool Use" },
  { value: "none", label: "All" },
];

export default function SidePanel() {
  const { connected, client } = useLiveAPIContext();
  const [open, setOpen] = useState(false);
  const loggerRef = useRef<HTMLDivElement>(null);
  const loggerLastHeightRef = useRef<number>(-1);
  const { log, logs } = useLoggerStore();

  const [textInput, setTextInput] = useState("");
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (loggerRef.current) {
      const el = loggerRef.current;
      const scrollHeight = el.scrollHeight;
      if (scrollHeight!== loggerLastHeightRef.current) {
        el.scrollTop = scrollHeight;
        loggerLastHeightRef.current = scrollHeight;
      }
    }
  }, [logs]);

  useEffect(() => {
    if (client && client.on) { // Check if client and client.on exist
      client.on("log", log);
      return () => {
        if (client && client.off) { // Check if client and client.off exist
          client.off("log", log);
        }
      };
    }
  }, [client, log]);


  const handleSubmit = () => {
    if (client && client.send) {
      client.send([{ text: textInput }]); 
  
      // Clear the input field AFTER sending the message
      setTextInput(""); 
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (connected && client && typeof client.send === 'function') {
      intervalId = setInterval(() => {
        setTextInput("."); // Set the input value
      }, 28000); // 28-second interval
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      setTextInput("");
    };
  }, [connected, client]);

    // New useEffect to trigger handleSubmit whenever textInput changes
    useEffect(() => {
      if (textInput === "." && connected && client && typeof client.send === 'function') {
        handleSubmit();
      }
    }, [textInput, connected, client]); // Add textInput as a dependency


  return (
    <div className={`side-panel ${open? "open": ""}`}>
      {/*... (rest of the JSX - header, indicators, etc. remain the same) */}
      <div className="side-panel-container" ref={loggerRef}>
        <Logger filter={(selectedOption?.value as LoggerFilterType) || "none"} />
      </div>
      <div className={cn("input-container", { disabled:!connected })}>
        <div className="input-content">
          <textarea
            className="input-area"
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" &&!e.shiftKey && connected && client && typeof client.send) { // Check conditions
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }
            }}
            onChange={(e) => setTextInput(e.target.value)}
            value={textInput}
          ></textarea>
          <span
            className={cn("input-content-placeholder", {
              hidden: textInput.length,
            })}
          >
            Type&nbsp;something...
          </span>

          <button
            className="send-button material-symbols-outlined filled"
            onClick={connected && client && typeof client.send === 'function'? handleSubmit: undefined} // Conditional onClick
            disabled={!connected} // Disable if not connected
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
}