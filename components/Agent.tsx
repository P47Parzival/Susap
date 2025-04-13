"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { createInterview } from "@/lib/actions/interview.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [currentInterviewId, setCurrentInterviewId] = useState<string | undefined>(interviewId);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onCallStart = () => {
      console.log("Call started");
      setCallStatus(CallStatus.ACTIVE);
      setIsDisconnecting(false);
    };

    const onCallEnd = () => {
      console.log("Call ended");
      // Don't set status to FINISHED here, let handleDisconnect do it
      // This prevents race conditions
    };

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        console.log("Received message:", message);
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      console.log("Speech start");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      console.log("Speech end");
      setIsSpeaking(false);
    };

    const onError = (error: any) => {
      console.error("Vapi error:", error);
      
      // Handle specific error types
      if (error && error.type === 'no-room') {
        console.log("Room was deleted, handling gracefully");
        // If we're not already disconnecting, handle this error
        if (!isDisconnecting) {
          handleGracefulDisconnect();
        }
      }
    };

    // Listen for connection status changes
    const onConnectionStatusChanged = (status: any) => {
      console.log("Connection status changed to:", status);
      if (status === "disconnected" && !isDisconnecting) {
        console.log("Connection disconnected, handling gracefully");
        handleGracefulDisconnect();
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);
    
    // Add a custom event listener for connection status
    window.addEventListener("online", () => {
      console.log("Browser is online");
    });
    
    window.addEventListener("offline", () => {
      console.log("Browser is offline");
      if (!isDisconnecting) {
        handleGracefulDisconnect();
      }
    });

    return () => {
      console.log("Cleaning up Vapi event listeners");
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
      
      // Remove custom event listeners
      window.removeEventListener("online", () => {});
      window.removeEventListener("offline", () => {});
    };
  }, [mounted, isDisconnecting]);

  // Add a separate effect to handle call status changes
  useEffect(() => {
    if (callStatus === CallStatus.FINISHED) {
      console.log("Call status changed to FINISHED, preparing to generate feedback");
      // We'll let the messages effect handle the actual feedback generation
    }
  }, [callStatus]);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      try {
        console.log("Starting feedback generation...");
        console.log("Messages:", messages);
        console.log("Interview ID:", currentInterviewId);
        console.log("User ID:", userId);

        if (!currentInterviewId || !userId) {
          console.error("Missing interviewId or userId");
          router.push("/");
          return;
        }

        const { success, feedbackId: id } = await createFeedback({
          interviewId: currentInterviewId,
          userId: userId,
          transcript: messages,
          feedbackId,
        });

        console.log("Feedback generation result:", { success, id });

        if (success && id) {
          router.push(`/interview/${currentInterviewId}/feedback`);
        } else {
          console.error("Failed to generate feedback");
          router.push("/");
        }
      } catch (error) {
        console.error("Error in handleGenerateFeedback:", error);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED && messages.length > 0) {
      // Generate feedback for both types
      handleGenerateFeedback(messages);
    }
  }, [messages, callStatus, feedbackId, currentInterviewId, router, type, userId]);

  const handleGracefulDisconnect = () => {
    if (isDisconnecting) return;
    
    try {
      console.log("Handling graceful disconnect...");
      setIsDisconnecting(true);
      
      // Set status to FINISHED to trigger feedback generation
      setCallStatus(CallStatus.FINISHED);
      
      // Try to stop the call gracefully
      try {
        console.log("Attempting to gracefully stop the call...");
        vapi.stop();
        console.log("Call stopped successfully");
      } catch (stopError) {
        console.error("Error stopping call:", stopError);
      }
    } catch (error) {
      console.error("Error in handleGracefulDisconnect:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleCall = async () => {
    try {
      console.log("Starting call...");
      setCallStatus(CallStatus.CONNECTING);
      setIsDisconnecting(false);

      // If in generate mode and no interviewId exists, create one
      let interviewIdToUse = currentInterviewId;
      if (type === "generate" && !interviewIdToUse && userId) {
        console.log("Creating new interview record...");
        const { success, interviewId: newInterviewId } = await createInterview({
          userId: userId,
          role: "Software Engineer",
          type: "Technical",
          techstack: ["JavaScript", "React", "Node.js"],
          finalized: false,
        });
        
        if (success && newInterviewId) {
          console.log("Created new interview with ID:", newInterviewId);
          interviewIdToUse = newInterviewId;
          setCurrentInterviewId(newInterviewId);
        } else {
          console.error("Failed to create interview record");
          setCallStatus(CallStatus.INACTIVE);
          return;
        }
      }

      if (type === "generate") {
        console.log("Using workflow ID:", process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID);
        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            username: userName,
            userid: userId,
            interviewid: interviewIdToUse,
          },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        console.log("Using interviewer workflow");
        await vapi.start(interviewer, {
          variableValues: {
            questions: formattedQuestions,
            interviewid: interviewIdToUse,
          },
        });
      }
    } catch (error) {
      console.error("Error in handleCall:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    if (isDisconnecting) return;
    
    try {
      console.log("Disconnecting call...");
      setIsDisconnecting(true);
      
      // First set the status to FINISHED to trigger feedback generation
      setCallStatus(CallStatus.FINISHED);
      
      // Use a more careful approach to stop the call
      try {
        // Try to gracefully stop the call
        console.log("Attempting to gracefully stop the call...");
        vapi.stop();
        console.log("Call stopped successfully");
      } catch (stopError) {
        console.error("Error stopping call:", stopError);
        
        // If the first attempt fails, try again with a different approach
        try {
          console.log("Trying alternative approach to stop the call...");
          // Force close the connection if needed
          if (typeof window !== 'undefined' && window.location) {
            window.location.reload();
          }
        } catch (reloadError) {
          console.error("Error reloading page:", reloadError);
        }
      }
    } catch (error) {
      console.error("Error in handleDisconnect:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  return (
    <>
      {mounted && (
        <>
          {/* Call View Container */}
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 w-full px-6 py-10 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-2xl">
            {/* AI Interviewer Card */}
            <div className="flex flex-col items-center text-center bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl shadow-xl w-[260px]">
              <div className="relative">
                <Image
                  src="/ai-avatar.png"
                  alt="AI Interviewer"
                  width={65}
                  height={65}
                  className="rounded-full object-cover border-2 border-white/30"
                />
                {isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse shadow-md" />
                )}
              </div>
              <h3 className="mt-4 text-white font-semibold text-lg tracking-wide">AI Interviewer</h3>
            </div>
  
            {/* User Card */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center shadow-xl w-[260px]">
              <Image
                src="/user-avatar.png"
                alt="User Avatar"
                width={120}
                height={120}
                className="rounded-full object-cover border border-white/20 shadow"
              />
              <h3 className="mt-4 text-white font-semibold text-lg tracking-wide">{userName}</h3>
            </div>
          </div>
  
          {/* Transcript Message */}
          {messages.length > 0 && (
            <div className="mt-6 w-full max-w-3xl mx-auto px-4">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl py-5 px-6 shadow-lg">
                <p
                  key={lastMessage}
                  className="text-white text-center text-base animate-fadeIn transition-opacity duration-500"
                >
                  {lastMessage}
                </p>
              </div>
            </div>
          )}
  
          {/* Call Button */}
          <div className="w-full flex justify-center mt-2">
            {callStatus !== "ACTIVE" ? (
              <button
                className="relative bg-cyan-500 hover:bg-cyan-600 text-white py-2.5 px-8 rounded-xl text-sm font-semibold shadow-md transition-all duration-300"
                onClick={handleCall}
              >
                {callStatus === "CONNECTING" && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 h-3 w-3 bg-white/40 rounded-full animate-ping" />
                )}
                <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED"
                    ? "Call"
                    : ". . ."}
                </span>
              </button>
            ) : (
              <button
                className="bg-red-600 hover:bg-red-700 text-white py-2.5 px-8 rounded-xl text-sm font-semibold shadow-md transition-all duration-300"
                onClick={handleDisconnect}
              >
                End
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Agent;
