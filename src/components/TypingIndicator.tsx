import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="animate-fade-in-up flex gap-3 px-4 py-4 md:px-8">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full gradient-bg">
        <Bot className="h-4 w-4 text-primary-foreground" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-chat-ai px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "0ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "200ms" }} />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
}
