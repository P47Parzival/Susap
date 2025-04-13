import { NextResponse } from "next/server";

export async function POST() {
  // Create a response with the cookie deletion
  const response = NextResponse.json({ success: true });
  
  // Delete the session cookie by setting it to expire immediately
  response.cookies.set("session", "", {
    maxAge: 0,
    path: "/",
  });
  
  return response;
} 