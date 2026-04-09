import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/hooks/useChatStore";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("animate-fade-in-up group flex gap-3 px-4 py-4 md:px-8", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-bg">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
      <div
        className={cn(
          "relative max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-chat-user text-chat-user-foreground rounded-br-md"
            : "bg-chat-ai text-chat-ai-foreground rounded-bl-md"
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div className={cn(
          "mt-2 flex items-center gap-2 text-[10px] opacity-60",
          isUser ? "justify-end" : "justify-start"
        )}>
          <span>{message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {!isUser && (
            <button onClick={handleCopy} className="opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-80">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
          <User className="h-4 w-4 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}
