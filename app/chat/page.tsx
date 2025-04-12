'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
          model: 'deepseek-chat'
        })
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.choices[0].message.content }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-semibold text-white mb-6">
        Chat with AI Assistant
      </h1>
  
      {/* Chat Card */}
      <Card className="p-6 mb-6 h-[60vh] overflow-y-auto bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-xl">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 px-5 py-3 rounded-2xl text-sm transition-all duration-300 max-w-[80%] ${
              message.role === "user"
                ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white ml-auto animate-slideInRight shadow-md"
                : "bg-white/10 text-white mr-auto animate-slideInLeft shadow-inner"
            }`}
          >
            {message.content}
          </div>
        ))}
  
        {isLoading && (
          <div className="text-center text-white/60 animate-pulse mt-2">
            AI is thinking...
          </div>
        )}
      </Card>
  
      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 rounded-xl border border-white/20 bg-white/10 text-white placeholder-white/60 shadow-inner backdrop-blur-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <Button
          type="submit"
          disabled={isLoading}
          className="btn-primary px-6 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
        >
          Send
        </Button>
      </form>
    </div>
  );
  

} 