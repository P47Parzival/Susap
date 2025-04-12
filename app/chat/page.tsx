'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const formatResponse = (content: string) => {
    // Remove excessive newlines
    let formatted = content.replace(/\n{3,}/g, '\n\n');
    
    // Remove markdown code blocks if they're empty or just whitespace
    formatted = formatted.replace(/```\s*\n\s*```/g, '');
    
    // Remove markdown code blocks but keep the content
    formatted = formatted.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```/g, '').trim();
    });
    
    // Remove markdown headers
    formatted = formatted.replace(/#{1,6}\s/g, '');
    
    // Remove markdown links but keep the text
    formatted = formatted.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Remove markdown bold and italic
    formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '$1');
    formatted = formatted.replace(/\*([^*]+)\*/g, '$1');
    
    // Trim whitespace
    formatted = formatted.trim();
    
    // Limit to 3 paragraphs maximum
    const paragraphs = formatted.split('\n\n');
    if (paragraphs.length > 3) {
      formatted = paragraphs.slice(0, 3).join('\n\n');
    }
    
    return formatted;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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'
        },
        body: JSON.stringify({
          messages: [
            { 
              role: 'system', 
              content: 'You are a concise interview preparation assistant. Provide brief, focused answers in 2-3 short paragraphs maximum. Avoid unnecessary details and get straight to the point. Use simple language and avoid jargon when possible.'
            },
            ...messages, 
            { role: 'user', content: userMessage }
          ],
          model: "qwen-2.5-32b",
          temperature: 0.2,
          max_tokens: 500, // Reduced for more concise responses
          top_p: 0.90,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from API');
      }

      const formattedResponse = formatResponse(data.choices[0].message.content);
      setMessages(prev => [...prev, { role: 'assistant', content: formattedResponse }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again. If the problem persists, please check the console for details.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex flex-col h-[80vh]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">Interview Prep Assistant</h1>
          <p className="text-white/70">Practice your interview skills with our AI coach</p>
        </div>
        
        {/* Chat Container */}
        <div className="flex-1 bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-white font-medium">Interview Coach</span>
            </div>
            <span className="text-gray-400 text-sm">Online</span>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-16 h-16 rounded-full bg-blue-600/20 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Welcome to Interview Prep</h3>
                <p className="text-gray-400 max-w-md mb-6">Ask me anything about interview preparation, technical concepts, or practice common interview questions.</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button 
                    onClick={() => setInput("Tell me about yourself")} 
                    className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Tell me about yourself
                  </button>
                  <button 
                    onClick={() => setInput("Why should we hire you?")} 
                    className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Why should we hire you?
                  </button>
                  <button 
                    onClick={() => setInput("What are your strengths and weaknesses?")} 
                    className="text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Strengths & weaknesses
                  </button>
                </div>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-2 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white"
                  }`}
                >
                  {message.content}
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center ml-2 flex-shrink-0">
                    <span className="text-white text-xs font-bold">You</span>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center mr-2 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="bg-gray-800 text-white px-4 py-3 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-800">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question or practice answers..."
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isLoading ? (
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                  </div>
                ) : (
                  "Send"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 