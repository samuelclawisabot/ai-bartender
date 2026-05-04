# 🚀 Deployment Guide

## Local Development

```bash
npm run dev
# Visit http://localhost:3000
```

## GitHub Deployment Steps

1. **Configure Git** (if not already done):
   ```bash
   git config --global user.email "you@example.com"
   git config --global user.name "Your Name"
   ```

2. **Add Remote and Push**:
   ```bash
   cd /home/ubuntu/.openclaw/workspace/ai-bartender
   
   # Create repository on GitHub (if not already created)
   gh repo create ai-bartender --public --source=. --remote=origin --push
   
   # Or if repo exists, just push:
   git add .
   git commit -m "Initial Speakeasy Noir AI Bartender deployment"
   git push -u origin main
   ```

3. **Set Up Environment Variables in GitHub**:
   - Go to your repository settings → Secrets and variables → Actions
   - Add `GEMINI_API_KEY` as an environment variable
   
4. **Deploy to Vercel** (Optional, recommended):
   ```bash
   npm install -g vercel
   vercel login
   vercel deploy --prod
   ```

## Production Build

```bash
npm run build
npm start
# Port: 3000
```

## Environment Variables Required

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google Gemini API key for LLM calls |

See `.env.example` for template.

> ⚠️ **Never commit `.env.local`** to Git! It's already excluded in `.gitignore`.

## Known Issues

### npm Vulnerabilities (2 found)
- 1 moderate, 1 high severity vulnerabilities detected
- These are in devDependencies and typically don't affect production builds
- If needed: `npm audit fix --production` before deployment

## Features Checklist

- [x] Glassmorphic UI with dark theme
- [x] Chat interface with Strict/Discovery modes  
- [x] Inventory management page
- [x] Standard bar kit (shaker, jigger, strainer, spoon)
- [ ] API integration with Gemini 3.1 Flash
- [ ] GitHub repository deployment

## Tech Stack

- **Framework**: Next.js 14.2+ (Pages Router)
- **UI**: Tailwind CSS
- **LLM**: Gemini 3.1 Flash
- **Icons**: Lucide React
