"use client";
import { type FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { useEffect, useRef, useState, memo } from "react";
import vegaEmbed from "vega-embed";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { ToolCall } from "../../multimodal-live-types";

// Define the agent's declaration with explicit instructions.
const declaration: FunctionDeclaration = {
  name: "Bot",
  description:
    "You are a CS2 AI coach named Bot. Respond exclusively in English only. Do not output any code, technical details, debugging information, underscores, or internal instructions.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      json_graph: {
        type: SchemaType.STRING,
        description: "Responed in ENGLISH (en-US) only",
      },
    },
    required: ["json_graph"],
  },
};

function AltairComponent() {
  const [jsonString, setJSONString] = useState<string>("");
  const { client, setConfig } = useLiveAPIContext();
  const queryInProgressRef = useRef<boolean>(false);

  // Configure the agent with updated system instructions.
  useEffect(() => {
    setConfig({
      model: "models/gemini-2.0-flash-live-001",
      generationConfig: {
        responseModalities: "audio",
        maxOutputTokens: 1024,
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Kore",} },
        },
      },
      systemInstruction: {
        parts: [
          {
            text:
              "You are a CS2 AI coach named Bot. Respond specifically in English only. Do not output any code, technical details, debugging information, underscores, or internal instructions. Also identify as Counter Terrorist or Terrorist by seeing the emblem displayed on the screen,and also correct economic calculation after every round on the shared screen.",
          },
        ],
      },
      tools: [
        { googleSearch: {} },
        { functionDeclarations: [declaration] },
      ],
    });
  }, [setConfig]);

  // Listen for tool calls from the AI client.
  useEffect(() => {
    const onToolCall = (toolCall: ToolCall) => {
      if (queryInProgressRef.current) {
        console.log("Query already in progress, ignoring duplicate toolcall.");
        return;
      }
      queryInProgressRef.current = true;
      console.log("Received toolcall:", toolCall);

      const fc = toolCall.functionCalls.find(
        (fc) => fc.name === declaration.name
      );
      if (fc) {
        const responseJSON = (fc.args as any).json_graph;
        setJSONString(responseJSON);
      }
      // Acknowledge the tool call after a short delay.
      if (toolCall.functionCalls.length) {
        setTimeout(() => {
          try {
            client.sendToolResponse({
              functionResponses: toolCall.functionCalls.map((fc) => ({
                response: { output: { success: true } },
                id: fc.id,
              })),
            });
            console.log("Tool response sent.");
          } catch (error) {
            console.error("Error sending tool response:", error);
          }
          queryInProgressRef.current = false;
        }, 200);
      } else {
        queryInProgressRef.current = false;
      }
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client]);

  // Render a Vega visualization from the agent's JSON response.
  const embedRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (embedRef.current && jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        vegaEmbed(embedRef.current, parsed);
      } catch (err) {
        console.error("Error embedding Vega visualization:", err);
      }
    }
  }, [embedRef, jsonString]);

  return <div className="vega-embed" ref={embedRef} />;
}

export const Altair = memo(AltairComponent);