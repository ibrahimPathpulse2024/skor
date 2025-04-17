    import React from "react";

    const StatusBar = ({ segments , filled }) => {
    return (
        <div className="flex items-center bg-[#1c1c1c] p-2 w-full max-w-4xl h-8 rounded-sm">
        <div className="flex items-center h-full flex-1 bg-[#3c312c] relative overflow-hidden mr-4 custom-clip">
            {Array.from({ length: segments }).map((_, i) => (
            <div
                key={i}
                className={`w-[33.1px] h-full mr-[2px] -skew-x-[30deg] ${
                i < filled ? "bg-[#ff4a3a]" : "bg-transparent"
                }`}
            ></div>
            ))}
        </div>
        <span className="text-white font-bold">MAX</span>
        </div>
    );
    };

    export default StatusBar;
