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

interface ContactInfo {
  name: string;
  email: string;
  subject: string;
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
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState<ContactInfo>({
    name: "",
    email: "",
    subject: "",
  });
  const [formError, setFormError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastTimestampRef = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Only start polling after session is created (NOT on open)
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

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const subject = formData.subject.trim();

    if (!name || !email || !subject) {
      setFormError("Todos los campos son obligatorios");
      return;
    }
    if (!validateEmail(email)) {
      setFormError("Ingresa un correo válido");
      return;
    }

    setContactInfo({ name, email, subject });
    await startSession({ name, email, subject });
  }

  async function startSession(info: ContactInfo) {
    setInitializing(true);
    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webchat-key": apiKey,
        },
        body: JSON.stringify({
          action: "start_session",
          content: info.subject,
          visitorName: info.name,
          visitorEmail: info.email,
          subject: info.subject,
          metadata: {
            name: info.name,
            email: info.email,
            subject: info.subject,
          },
        }),
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
        const botContent =
          data.message || data.content || data.reply || data.text;
        const botId = data.id || data.messageId || `poll-${Date.now()}`;
        setMessages((prev) => {
          if (prev.some((m) => m.id === botId)) return prev;
          return [
            ...prev,
            {
              id: botId,
              role: "bot",
              content: botContent,
              timestamp: Date.now(),
            },
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
              {
                id: botId,
                role: "bot",
                content: botContent,
                timestamp: Date.now(),
              },
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
            content: (m.content || m.message || m.text || m.reply ||
              "") as string,
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
      let botContent =
        data.message ||
        data.content ||
        data.reply ||
        data.response ||
        data.answer;
      // Try nested under data
      if (!botContent && data.data) {
        const d = data.data;
        botContent =
          d.message || d.content || d.reply || d.response || d.answer || d.text;
      }
      // Try nested under result
      if (!botContent && data.result) {
        const r = data.result;
        botContent =
          typeof r === "string"
            ? r
            : r.message || r.content || r.reply || r.text;
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

  // Pre-chat form view
  const formView = (
    <div className="ai-bot-content">
      <div className="px-1 py-2">
        <p className="text-sm text-gray-600 mb-4">
          Para iniciar la conversación, por favor completa los siguientes datos:
        </p>
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Nombre completo
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((f) => ({ ...f, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((f) => ({ ...f, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="correo@ejemplo.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Asunto
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) =>
                setFormData((f) => ({ ...f, subject: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="¿En qué podemos ayudarte?"
            />
          </div>
          {formError && (
            <p className="text-xs text-red-500">{formError}</p>
          )}
          <button
            type="submit"
            disabled={initializing}
            className="w-full py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {initializing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Conectando...
              </>
            ) : (
              <>
                <span className="material-icons text-sm">chat</span>
                Iniciar conversación
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );

  // Chat view (messages + input)
  const chatView = (
    <>
      <div className="ai-bot-content">
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
            disabled={!sessionId || loading}
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
    </>
  );

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

        {/* Show form if no contact info submitted yet, otherwise show chat */}
        {!contactInfo ? formView : chatView}
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
