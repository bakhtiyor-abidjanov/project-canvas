import { Plus, MessageSquare, Trash2, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatSession } from "@/hooks/useChatStore";
import { cn } from "@/lib/utils";

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function ChatSidebar({ sessions, activeSessionId, onSelect, onCreate, onDelete, onClose }: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-chat-sidebar">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-chat-sidebar-foreground">Chat History</h2>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={onCreate} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 lg:hidden">
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto chat-scrollbar p-2 space-y-1">
        {sessions.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-muted-foreground">No conversations yet</p>
        )}
        {sessions.map((session) => (
          <div
            key={session.id}
            className={cn(
              "group flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors",
              session.id === activeSessionId
                ? "bg-primary/10 text-foreground"
                : "text-chat-sidebar-foreground hover:bg-chat-sidebar-hover"
            )}
            onClick={() => onSelect(session.id)}
          >
            <MessageSquare className="h-4 w-4 shrink-0 opacity-60" />
            <span className="flex-1 truncate text-sm">{session.title}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(session.id);
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    </aside>
  );
}
