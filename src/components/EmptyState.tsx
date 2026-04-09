import { Bot, Sparkles, Zap, Shield } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Multiple AI Providers", desc: "Groq, Google AI, and OpenAI" },
  { icon: Zap, title: "Fast Responses", desc: "Real-time streaming chat" },
  { icon: Shield, title: "Secure by Design", desc: "API keys stored locally" },
];

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl gradient-bg shadow-lg">
        <Bot className="h-8 w-8 text-primary-foreground" />
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">Private AI Chat</h1>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        A secure, private AI chat application. Configure your API key in settings and start chatting.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center transition-shadow hover:shadow-md">
            <Icon className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-card-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
