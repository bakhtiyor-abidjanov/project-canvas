import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="mx-auto flex max-w-3xl items-end gap-3 rounded-2xl border border-border bg-chat-input-bg p-2 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/30">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!value.trim() || disabled}
          className="h-9 w-9 shrink-0 rounded-xl gradient-bg text-primary-foreground hover:opacity-90 disabled:opacity-40"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        Press Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
