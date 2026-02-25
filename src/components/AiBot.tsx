"use client";

import { useState } from "react";

export default function AiBot() {
  const [open, setOpen] = useState(false);

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
          <div className="ai-chat-msg bot">
            Hola. Soy el asistente estratégico de Alto Tráfico. ¿En qué área
            buscas optimizar tu negocio hoy?
          </div>
        </div>
        <div className="ai-bot-input-area">
          <div className="relative">
            <input
              className="w-full text-sm border-none bg-gray-50 rounded-lg py-3 px-4 focus:ring-1 focus:ring-primary focus:bg-white transition-colors"
              placeholder="Escribe tu consulta..."
              type="text"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
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
