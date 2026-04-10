README.md
# Private AI Chat

A professional, privacy-focused AI chat interface built with React and TypeScript. All API keys and conversations stay in your browser — nothing is sent to any third-party server except the AI provider you choose.

**Author:** Baxtiyor Abidjanov

---

## Features

- **Privacy-first** — API keys stored only in your browser's localStorage
- **Multi-provider support** — Groq, Google Gemini, and OpenAI
- **Chat session management** — Create, switch, and delete conversations
- **Dark / Light mode** — Toggle with automatic persistence
- **Copy to clipboard** — One-click copy on any message
- **Streaming-ready UI** — Typing indicator and smooth animations
- **Fully responsive** — Works on desktop, tablet, and mobile

---

## Tech Stack

- **React 18** + **TypeScript 5**
- **Vite 5** (dev server & build)
- **Tailwind CSS 3** + **shadcn/ui**
- **React Router 6**

---

## Prerequisites

Make sure you have one of the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher) + npm
- **or** [Bun](https://bun.sh/) (v1 or higher)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com//private-ai-chat.git
cd private-ai-chat
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Or using Bun:
```bash
bun install
```

### 3. Start the development server

Using npm:
```bash
npm run dev
```

Or using Bun:
```bash
bun run dev
```

The app will be available at **http://localhost:8080**.

### 4. Build for production

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

---

## Configuration

1. Open the app in your browser
2. Click the **⚙️ Settings** icon in the sidebar
3. Select your AI provider (Groq, Gemini, or OpenAI)
4. Paste your API key — it is stored **only** in your browser
5. Start chatting!

### Supported Providers

| Provider | Models | Get API Key |
|----------|--------|-------------|
| **Groq** | llama-3.3-70b, mixtral-8x7b, gemma2-9b | [console.groq.com](https://console.groq.com) |
| **Google Gemini** | gemini-2.0-flash, gemini-1.5-pro | [aistudio.google.com](https://aistudio.google.com) |
| **OpenAI** | gpt-4o, gpt-4o-mini, gpt-3.5-turbo | [platform.openai.com](https://platform.openai.com) |

---

## Project Structure

```
src/
├── components/        # UI components
│   ├── ChatInput.tsx       # Message input with auto-expand
│   ├── ChatMessage.tsx     # Message bubble with copy button
│   ├── ChatSidebar.tsx     # Session list & navigation
│   ├── EmptyState.tsx      # Welcome screen
│   ├── SettingsDialog.tsx  # Provider & API key config
│   ├── ThemeToggle.tsx     # Dark/light mode switch
│   ├── TypingIndicator.tsx # Animated typing dots
│   └── ui/                 # shadcn/ui primitives
├── hooks/
│   ├── useChatStore.ts     # Chat state & localStorage persistence
│   └── useTheme.ts         # Theme state management
├── pages/
│   └── Index.tsx           # Main chat page
├── index.css              # Tailwind config & design tokens
└── main.tsx               # App entry point
```
