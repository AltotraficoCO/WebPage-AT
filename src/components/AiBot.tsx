"use client";

import { useState, useRef, useEffect, useCallback } from "react";

const API_URL = "https://varylo.vercel.app/api/webchat";
const API_KEY = "wc_2983925e1b0c5b03a365cf0da7c3e9af7702e25292edb003";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
}

export default function AiBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTimestampRef = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Start session when chat opens for the first time
  useEffect(() => {
    if (open && !sessionId && !initializing) {
      startSession();
    }
  }, [open, sessionId, initializing]);

  // Polling for new messages
  useEffect(() => {
    if (sessionId && open) {
      pollingRef.current = setInterval(() => {
        pollMessages();
      }, 2000);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [sessionId, open]);

  async function startSession() {
    setInitializing(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webchat-key": API_KEY,
        },
        body: JSON.stringify({ action: "start_session" }),
      });
      const data = await res.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
        lastTimestampRef.current = Date.now();
        // Add welcome message if the API returns one
        if (data.message) {
          setMessages([
            {
              id: "welcome",
              role: "bot",
              content: data.message,
              timestamp: Date.now(),
            },
          ]);
        } else {
          setMessages([
            {
              id: "welcome",
              role: "bot",
              content:
                "Hola. Soy el asistente de Alto Tráfico. ¿En qué puedo ayudarte?",
              timestamp: Date.now(),
            },
          ]);
        }
      }
    } catch {
      setMessages([
        {
          id: "error",
          role: "bot",
          content: "No pude conectar. Intenta de nuevo más tarde.",
          timestamp: Date.now(),
        },
      ]);
    }
    setInitializing(false);
  }

  async function pollMessages() {
    if (!sessionId) return;
    try {
      const res = await fetch(
        `${API_URL}?sessionId=${sessionId}&after=${lastTimestampRef.current}`,
        {
          headers: {
            "x-webchat-key": API_KEY,
          },
        }
      );
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        const newMessages: Message[] = data.messages
          .filter((m: { role: string }) => m.role !== "user")
          .map((m: { id?: string; content: string; timestamp?: number }) => ({
            id: m.id || Date.now().toString() + Math.random(),
            role: "bot" as const,
            content: m.content,
            timestamp: m.timestamp || Date.now(),
          }));

        if (newMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const unique = newMessages.filter(
              (m: Message) => !existingIds.has(m.id)
            );
            return unique.length > 0 ? [...prev, ...unique] : prev;
          });
          lastTimestampRef.current = Date.now();
          setLoading(false);
        }
      }
    } catch {
      // Silent fail on polling
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || !sessionId || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webchat-key": API_KEY,
        },
        body: JSON.stringify({
          action: "send_message",
          sessionId,
          content: text,
        }),
      });
      const data = await res.json();

      // If the API returns an immediate response
      if (data.message || data.content) {
        const botMsg: Message = {
          id: data.id || `bot-${Date.now()}`,
          role: "bot",
          content: data.message || data.content,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
        lastTimestampRef.current = Date.now();
        setLoading(false);
      }
      // Otherwise polling will pick up the response
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "bot",
          content: "Error al enviar. Intenta de nuevo.",
          timestamp: Date.now(),
        },
      ]);
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className={`ai-bot-container ${open ? "open" : ""}`}>
      <div className="ai-bot-panel">
        <div className="ai-bot-header">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            <span className="text-sm font-medium text-gray-900">
              AT Assistant
            </span>
          </div>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => setOpen(false)}
          >
            <span className="material-icons text-lg">close</span>
          </button>
        </div>
        <div className="ai-bot-content">
          {initializing ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ai-chat-msg ${msg.role === "user" ? "user" : "bot"}`}
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="ai-chat-msg bot">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <div className="ai-bot-input-area">
          <div className="relative">
            <input
              className="w-full text-sm border-none bg-gray-50 rounded-lg py-3 px-4 pr-10 focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
              placeholder="Escribe tu consulta..."
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!sessionId || initializing}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !sessionId || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary disabled:opacity-30 transition-colors"
            >
              <span className="material-icons text-lg">send</span>
            </button>
          </div>
        </div>
      </div>

      <div
        className="ai-bot-trigger animate-breathe-glow"
        onClick={() => setOpen(!open)}
      >
        <div className="ai-bot-ring" />
        <div className="ai-bot-icon">
          <div className="ai-bot-core" />
        </div>
      </div>
    </div>
  );
}
