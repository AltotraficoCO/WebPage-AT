"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface AiBotProps {
  enabled: boolean;
  apiUrl: string;
  apiKey: string;
  welcomeMessage: string;
  botName: string;
}

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: number;
}

export default function AiBot({
  enabled,
  apiUrl,
  apiKey,
  welcomeMessage,
  botName,
}: AiBotProps) {
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

  useEffect(() => {
    if (open && !sessionId && !initializing && apiUrl && apiKey) {
      startSession();
    }
  }, [open, sessionId, initializing, apiUrl, apiKey]);

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

  if (!enabled || !apiUrl || !apiKey) return null;

  async function startSession() {
    setInitializing(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webchat-key": apiKey,
        },
        body: JSON.stringify({ action: "start_session" }),
      });
      const data = await res.json();
      console.log("[AiBot] start_session response:", JSON.stringify(data));
      if (data.sessionId) {
        setSessionId(data.sessionId);
        lastTimestampRef.current = Date.now();
        setMessages([
          {
            id: "welcome",
            role: "bot",
            content: data.message || welcomeMessage,
            timestamp: Date.now(),
          },
        ]);
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
        `${apiUrl}?sessionId=${sessionId}&after=${lastTimestampRef.current}`,
        { headers: { "x-webchat-key": apiKey } }
      );
      const data = await res.json();
      console.log("[AiBot] poll response:", JSON.stringify(data));

      // Handle array of messages - check multiple possible locations
      let rawMessages = data.messages || data.results || [];
      if (!Array.isArray(rawMessages) && Array.isArray(data.data)) {
        rawMessages = data.data;
      }

      // Handle single message response (direct fields)
      if (
        (!Array.isArray(rawMessages) || rawMessages.length === 0) &&
        (data.message || data.content || data.reply || data.text)
      ) {
        const botContent = data.message || data.content || data.reply || data.text;
        const botId = data.id || data.messageId || `poll-${Date.now()}`;
        setMessages((prev) => {
          if (prev.some((m) => m.id === botId)) return prev;
          return [
            ...prev,
            { id: botId, role: "bot", content: botContent, timestamp: Date.now() },
          ];
        });
        lastTimestampRef.current = Date.now();
        setLoading(false);
        return;
      }

      // Handle single message nested under data object
      if (
        (!Array.isArray(rawMessages) || rawMessages.length === 0) &&
        data.data &&
        !Array.isArray(data.data)
      ) {
        const d = data.data;
        const botContent = d.message || d.content || d.reply || d.text;
        if (botContent) {
          const botId = d.id || d.messageId || `poll-${Date.now()}`;
          setMessages((prev) => {
            if (prev.some((m) => m.id === botId)) return prev;
            return [
              ...prev,
              { id: botId, role: "bot", content: botContent, timestamp: Date.now() },
            ];
          });
          lastTimestampRef.current = Date.now();
          setLoading(false);
          return;
        }
      }

      if (Array.isArray(rawMessages) && rawMessages.length > 0) {
        const newMessages: Message[] = rawMessages
          .filter((m: Record<string, unknown>) => {
            const role = (m.role || m.sender || m.type || "") as string;
            return role !== "user" && role !== "human";
          })
          .map((m: Record<string, unknown>) => ({
            id: (m.id as string) || `poll-${Date.now()}-${Math.random()}`,
            role: "bot" as const,
            content: (m.content || m.message || m.text || m.reply || "") as string,
            timestamp: (m.timestamp as number) || Date.now(),
          }))
          .filter((m: Message) => m.content);

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
    } catch (err) {
      console.log("[AiBot] poll error:", err);
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
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webchat-key": apiKey,
        },
        body: JSON.stringify({
          action: "send_message",
          sessionId,
          content: text,
        }),
      });
      const data = await res.json();
      console.log("[AiBot] send_message response:", JSON.stringify(data));
      // Try direct fields
      let botContent = data.message || data.content || data.reply || data.response || data.answer;
      // Try nested under data
      if (!botContent && data.data) {
        const d = data.data;
        botContent = d.message || d.content || d.reply || d.response || d.answer || d.text;
      }
      // Try nested under result
      if (!botContent && data.result) {
        const r = data.result;
        botContent = typeof r === "string" ? r : (r.message || r.content || r.reply || r.text);
      }
      if (botContent) {
        const botMsg: Message = {
          id: data.id || data.messageId || `bot-${Date.now()}`,
          role: "bot",
          content: botContent,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, botMsg]);
        lastTimestampRef.current = Date.now();
        setLoading(false);
      }
      // If no immediate response, polling will pick it up
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
              {botName}
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
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
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
