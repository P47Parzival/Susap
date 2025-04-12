"use server";

import { db } from "@/firebase/admin";

interface CreateInterviewParams {
  userId: string;
  role: string;
  type: string;
  techstack: string[];
  finalized: boolean;
}

export async function createInterview(params: CreateInterviewParams) {
  const { userId, role, type, techstack, finalized } = params;

  try {
    const interviewRef = db.collection("interviews").doc();
    
    const interview = {
      userId,
      role,
      type,
      techstack,
      finalized,
      createdAt: new Date().toISOString(),
    };

    await interviewRef.set(interview);

    return { success: true, interviewId: interviewRef.id };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false };
  }
} 