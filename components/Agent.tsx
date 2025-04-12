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

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const onCallStart = () => {
      console.log("Call started");
      setCallStatus(CallStatus.ACTIVE);
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

    const onError = (error: Error) => {
      console.error("Vapi error:", error);
      // Don't change state here, let the error propagate to the appropriate handler
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      console.log("Cleaning up Vapi event listeners");
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [mounted]);

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

  const handleCall = async () => {
    try {
      console.log("Starting call...");
      setCallStatus(CallStatus.CONNECTING);

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
    try {
      console.log("Disconnecting call...");
      
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
          <div className="call-view">
            {/* AI Interviewer Card */}
            <div className="card-interviewer">
              <div className="avatar">
                <Image
                  src="/ai-avatar.png"
                  alt="profile-image"
                  width={65}
                  height={54}
                  className="object-cover"
                />
                {isSpeaking && <span className="animate-speak" />}
              </div>
              <h3>AI Interviewer</h3>
            </div>

            {/* User Profile Card */}
            <div className="card-border">
              <div className="card-content">
                <Image
                  src="/user-avatar.png"
                  alt="profile-image"
                  width={539}
                  height={539}
                  className="rounded-full object-cover size-[120px]"
                />
                <h3>{userName}</h3>
              </div>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="transcript-border">
              <div className="transcript">
                <p
                  key={lastMessage}
                  className={cn(
                    "transition-opacity duration-500 opacity-0",
                    "animate-fadeIn opacity-100"
                  )}
                >
                  {lastMessage}
                </p>
              </div>
            </div>
          )}

          <div className="w-full flex justify-center">
            {callStatus !== "ACTIVE" ? (
              <button className="relative btn-call" onClick={() => handleCall()}>
                <span
                  className={cn(
                    "absolute animate-ping rounded-full opacity-75",
                    callStatus !== "CONNECTING" && "hidden"
                  )}
                />

                <span className="relative">
                  {callStatus === "INACTIVE" || callStatus === "FINISHED"
                    ? "Call"
                    : ". . ."}
                </span>
              </button>
            ) : (
              <button className="btn-disconnect" onClick={() => handleDisconnect()}>
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
