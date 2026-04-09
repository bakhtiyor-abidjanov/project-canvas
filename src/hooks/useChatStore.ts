import { useState, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function loadSessions(): ChatSession[] {
  try {
    const stored = localStorage.getItem("chat-sessions");
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        messages: s.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
      }));
    }
  } catch {}
  return [];
}

function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem("chat-sessions", JSON.stringify(sessions));
}

export function useChatStore() {
  const [sessions, setSessions] = useState<ChatSession[]>(loadSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    () => sessions[0]?.id ?? null
  );
  const [isLoading, setIsLoading] = useState(false);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const updateSessions = useCallback((updater: (prev: ChatSession[]) => ChatSession[]) => {
    setSessions((prev) => {
      const next = updater(prev);
      saveSessions(next);
      return next;
    });
  }, []);

  const createSession = useCallback(() => {
    const session: ChatSession = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    };
    updateSessions((prev) => [session, ...prev]);
    setActiveSessionId(session.id);
    return session.id;
  }, [updateSessions]);

  const deleteSession = useCallback(
    (id: string) => {
      updateSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        setSessions((prev) => {
          const remaining = prev.filter((s) => s.id !== id);
          setActiveSessionId(remaining[0]?.id ?? null);
          return prev;
        });
      }
    },
    [activeSessionId, updateSessions]
  );

  const sendMessage = useCallback(
    async (content: string, apiKey: string, model: string, provider: string) => {
      let sessionId = activeSessionId;
      if (!sessionId) {
        sessionId = createSession();
      }

      const userMsg: Message = {
        id: generateId(),
        role: "user",
        content,
        timestamp: new Date(),
      };

      updateSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const isFirst = s.messages.length === 0;
          return {
            ...s,
            title: isFirst ? content.slice(0, 40) + (content.length > 40 ? "..." : "") : s.title,
            messages: [...s.messages, userMsg],
          };
        })
      );

      setIsLoading(true);

      try {
        const response = await callLLMAPI(content, apiKey, model, provider, 
          sessions.find(s => s.id === sessionId)?.messages ?? []);

        const assistantMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };

        updateSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, messages: [...s.messages, assistantMsg] } : s
          )
        );
      } catch (error: any) {
        const errorMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: `⚠️ Error: ${error.message || "Something went wrong. Please check your API key and try again."}`,
          timestamp: new Date(),
        };

        updateSessions((prev) =>
          prev.map((s) =>
            s.id === sessionId ? { ...s, messages: [...s.messages, errorMsg] } : s
          )
        );
      } finally {
        setIsLoading(false);
      }
    },
    [activeSessionId, createSession, updateSessions, sessions]
  );

  return {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    sendMessage,
    isLoading,
  };
}

async function callLLMAPI(
  content: string,
  apiKey: string,
  model: string,
  provider: string,
  history: Message[]
): Promise<string> {
  if (!apiKey) {
    throw new Error("API key is missing. Please add your API key in Settings.");
  }

  const messages = [
    ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content },
  ];

  let url: string;
  let headers: Record<string, string>;
  let body: any;

  switch (provider) {
    case "groq":
      url = "https://api.groq.com/openai/v1/chat/completions";
      headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      body = { model: model || "llama-3.1-8b-instant", messages, temperature: 0.7, max_tokens: 2048 };
      break;
    case "google":
      url = `https://generativelanguage.googleapis.com/v1beta/models/${model || "gemini-2.0-flash"}:generateContent?key=${apiKey}`;
      headers = { "Content-Type": "application/json" };
      body = {
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
      };
      break;
    case "openai":
    default:
      url = "https://api.openai.com/v1/chat/completions";
      headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
      body = { model: model || "gpt-3.5-turbo", messages, temperature: 0.7, max_tokens: 2048 };
      break;
  }

  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `API request failed with status ${res.status}`
    );
  }

  const data = await res.json();

  if (provider === "google") {
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response received.";
  }

  return data.choices?.[0]?.message?.content || "No response received.";
}
