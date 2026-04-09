import { Settings, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface AISettings {
  provider: string;
  model: string;
  apiKey: string;
}

const PROVIDERS = [
  { value: "groq", label: "Groq (Free)", models: ["llama-3.1-8b-instant", "llama-3.3-70b-versatile", "mixtral-8x7b-32768"] },
  { value: "google", label: "Google AI (Free)", models: ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"] },
  { value: "openai", label: "OpenAI (Paid)", models: ["gpt-3.5-turbo", "gpt-4o-mini", "gpt-4o"] },
];

interface SettingsDialogProps {
  settings: AISettings;
  onSave: (settings: AISettings) => void;
}

export function SettingsDialog({ settings, onSave }: SettingsDialogProps) {
  const [open, setOpen] = useState(false);
  const [local, setLocal] = useState(settings);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setLocal(settings);
  }, [settings]);

  const currentProvider = PROVIDERS.find((p) => p.value === local.provider) ?? PROVIDERS[0];

  const handleProviderChange = (provider: string) => {
    const p = PROVIDERS.find((pr) => pr.value === provider)!;
    setLocal({ ...local, provider, model: p.models[0] });
  };

  const handleSave = () => {
    onSave(local);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>Configure your LLM provider and API key. Keys are stored locally in your browser.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Provider</Label>
            <Select value={local.provider} onValueChange={handleProviderChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Model</Label>
            <Select value={local.model} onValueChange={(m) => setLocal({ ...local, model: m })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {currentProvider.models.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>API Key</Label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                value={local.apiKey}
                onChange={(e) => setLocal({ ...local, apiKey: e.target.value })}
                placeholder="Enter your API key"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get a free key from{" "}
              {local.provider === "groq" && <a href="https://console.groq.com/" target="_blank" rel="noopener" className="text-primary underline">console.groq.com</a>}
              {local.provider === "google" && <a href="https://aistudio.google.com/" target="_blank" rel="noopener" className="text-primary underline">aistudio.google.com</a>}
              {local.provider === "openai" && <a href="https://platform.openai.com/" target="_blank" rel="noopener" className="text-primary underline">platform.openai.com</a>}
            </p>
          </div>
          <Button onClick={handleSave} className="w-full gradient-bg text-primary-foreground">
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
