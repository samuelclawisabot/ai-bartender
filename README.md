# 🍸 Speakeasy Noir - AI Bartender

A full-stack, AI-powered bartending application powered by Gemini 3.1 Flash.

## ✨ Features

- **Chat Interface**: Glassmorphic, dark-themed chat for ordering drinks
- **Inventory Management**: Card-based UI to manage spirits, liqueurs, mixers, and garnishes
- **Two Modes**:
  - **Strict Mode** 🔒: AI only suggests drinks using available inventory
  - **Discovery Mode** 🔍: AI can suggest drinks missing 1-2 items (labeled "MISSING - Recommended to Buy")
- **Standard Kit**: Always includes shaker, jigger, strainer, and bar spoon

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd ai-bartender
npm install
```

### Environment Setup

Create a `.env.local` file:

```bash
cp .env.example .env.local
nano .env.local
```

Add your Gemini API key:

```
GEMINI_API_KEY=your_api_key_here
```

[Get an API key from Google AI Studio](https://aistudio.google.com/)

### Development

```bash
npm run dev
```

Visit `http://localhost:3000` and navigate to:
- `/chat` - Order drinks with the AI bartender
- `/inventory` - Manage your bar inventory

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
ai-bartender/
├── pages/
│   ├── api/
│   │   ├── chat.ts          # Gemini API endpoint
│   │   └── inventory.ts     # Inventory management
│   ├── chat/                # Chat interface
│   └── inventory/           # Inventory management
├── styles/
│   └── _globals.css         # Global styles
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
└── package.json             # Dependencies
```

## 🔧 Configuration

### Tailwind CSS

The project uses a custom dark theme with neon accents:
- Noir background tones (900-600)
- Neon cyan, magenta, purple, and lime accents
- Glassmorphic effects with backdrop-blur

### API Integration

The `/api/chat` endpoint calls Gemini 3.1 Flash with dynamic system prompts based on inventory and mode selection.

## 🎨 Design Philosophy

Inspired by underground speakeasy bars - dark, mysterious, sophisticated. The glassmorphic UI creates a modern twist on the classic prohibition-era aesthetic.

## 📝 License

MIT License
