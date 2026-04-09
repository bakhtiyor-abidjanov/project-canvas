import { useState, useRef, useEffect } from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatSidebar } from "@/components/ChatSidebar";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { TypingIndicator } from "@/components/TypingIndicator";
import { EmptyState } from "@/components/EmptyState";
import { SettingsDialog, type AISettings } from "@/components/SettingsDialog";
import { useTheme } from "@/hooks/useTheme";
import { useChatStore } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";

function loadSettings(): AISettings {
  try {
    const stored = localStorage.getItem("ai-settings");
    if (stored) return JSON.parse(stored);
  } catch {}
  return { provider: "groq", model: "llama-3.1-8b-instant", apiKey: "" };
}

export default function Index() {
  const { theme, toggleTheme } = useTheme();
  const {
    sessions,
    activeSession,
    activeSessionId,
    setActiveSessionId,
    createSession,
    deleteSession,
    sendMessage,
    isLoading,
  } = useChatStore();

  const [settings, setSettings] = useState<AISettings>(loadSettings);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSaveSettings = (s: AISettings) => {
    setSettings(s);
    localStorage.setItem("ai-settings", JSON.stringify(s));
  };

  const handleSend = (content: string) => {
    sendMessage(content, settings.apiKey, settings.model, settings.provider);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isLoading]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={(id) => {
            setActiveSessionId(id);
            setSidebarOpen(false);
          }}
          onCreate={() => {
            createSession();
            setSidebarOpen(false);
          }}
          onDelete={deleteSession}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <PanelLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-xs font-bold text-primary-foreground">AI</span>
              </div>
              <h1 className="text-base font-semibold text-foreground">Private AI Chat</h1>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="hidden sm:inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {settings.provider} · {settings.model}
            </span>
            <SettingsDialog settings={settings} onSave={handleSaveSettings} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </header>

        {/* Messages */}
        {!activeSession || activeSession.messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex-1 overflow-y-auto chat-scrollbar">
            <div className="mx-auto max-w-3xl py-4">
              {activeSession.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input */}
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
