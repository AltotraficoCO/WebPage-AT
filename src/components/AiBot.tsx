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
  timestamp: string; // ISO date string from Varylo
}

interface ContactInfo {
  name: string;
  email: string;
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
  });
  const [formError, setFormError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPollDateRef = useRef<string | null>(null);
  const pollErrorCount = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Poll for new messages via GET (only after session exists)
  useEffect(() => {
    if (sessionId && open) {
      pollingRef.current = setInterval(() => {
        pollMessages();
      }, 3000);
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

    if (!name || !email) {
      setFormError("Todos los campos son obligatorios");
      return;
    }
    if (!validateEmail(email)) {
      setFormError("Ingresa un correo válido");
      return;
    }

    const info = { name, email };
    setContactInfo(info);
    await startSession(info);
  }

  // Varylo creates session on first message - send subject as first message
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
          content: `Hola, soy ${info.name}`,
          visitorName: info.name,
          visitorEmail: info.email,
        }),
      });
      const data = await res.json();
      console.log("[AiBot] start response:", JSON.stringify(data));

      if (data.sessionId) {
        setSessionId(data.sessionId);
        lastPollDateRef.current = new Date().toISOString();
        pollErrorCount.current = 0;

        // Add welcome message
        const initialMessages: Message[] = [
          {
            id: "welcome",
            role: "bot",
            content: welcomeMessage,
            timestamp: new Date().toISOString(),
          },
        ];

        // Add bot responses from the pipeline if any
        if (data.responses && Array.isArray(data.responses)) {
          for (const r of data.responses) {
            if (r.direction === "OUTBOUND" && r.content) {
              initialMessages.push({
                id: r.id,
                role: "bot",
                content: r.content,
                timestamp: r.createdAt,
              });
              lastPollDateRef.current = r.createdAt;
            }
          }
        }

        setMessages(initialMessages);
      } else {
        setMessages([
          {
            id: "error",
            role: "bot",
            content: data.error || "Error al iniciar sesión.",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages([
        {
          id: "error",
          role: "bot",
          content: "No pude conectar. Intenta de nuevo más tarde.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    setInitializing(false);
  }

  // GET /api/webchat?sessionId=xxx&after=ISODateString
  async function pollMessages() {
    if (!sessionId) return;
    // Stop polling after too many consecutive errors
    if (pollErrorCount.current >= 5) {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
      return;
    }

    try {
      const url = lastPollDateRef.current
        ? `${apiUrl}?sessionId=${sessionId}&after=${encodeURIComponent(lastPollDateRef.current)}`
        : `${apiUrl}?sessionId=${sessionId}`;

      const res = await fetch(url, {
        headers: { "x-webchat-key": apiKey },
      });

      if (!res.ok) {
        pollErrorCount.current++;
        console.log("[AiBot] poll error:", res.status);
        return;
      }

      const data = await res.json();
      pollErrorCount.current = 0; // Reset on success

      if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
        // Only add OUTBOUND (bot) messages we haven't seen
        const botMessages: Message[] = data.messages
          .filter((m: { direction: string; content: string }) => m.direction === "OUTBOUND" && m.content)
          .map((m: { id: string; content: string; createdAt: string }) => ({
            id: m.id,
            role: "bot" as const,
            content: m.content,
            timestamp: m.createdAt,
          }));

        if (botMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMsgs = botMessages.filter((m: Message) => !existingIds.has(m.id));
            return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
          });

          // Update the poll cursor to the latest message timestamp
          const latest = botMessages[botMessages.length - 1];
          lastPollDateRef.current = latest.timestamp;
          setLoading(false);
        }
      }
    } catch (err) {
      pollErrorCount.current++;
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
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Safety timeout: unlock input after 30s
    const safetyTimeout = setTimeout(() => {
      setLoading(false);
    }, 30000);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-webchat-key": apiKey,
        },
        body: JSON.stringify({
          sessionId,
          content: text,
        }),
      });
      const data = await res.json();
      console.log("[AiBot] send_message response:", JSON.stringify(data));

      // Varylo returns { sessionId, messageId, responses: [...] }
      if (data.responses && Array.isArray(data.responses) && data.responses.length > 0) {
        clearTimeout(safetyTimeout);
        const botMessages: Message[] = data.responses
          .filter((r: { direction: string; content: string }) => r.direction === "OUTBOUND" && r.content)
          .map((r: { id: string; content: string; createdAt: string }) => ({
            id: r.id,
            role: "bot" as const,
            content: r.content,
            timestamp: r.createdAt,
          }));

        if (botMessages.length > 0) {
          setMessages((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const newMsgs = botMessages.filter((m: Message) => !existingIds.has(m.id));
            return newMsgs.length > 0 ? [...prev, ...newMsgs] : prev;
          });
          const latest = botMessages[botMessages.length - 1];
          lastPollDateRef.current = latest.timestamp;
        }
        setLoading(false);
      }
      // If no immediate responses, polling will pick them up
    } catch {
      clearTimeout(safetyTimeout);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: "bot",
          content: "Error al enviar. Intenta de nuevo.",
          timestamp: new Date().toISOString(),
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
