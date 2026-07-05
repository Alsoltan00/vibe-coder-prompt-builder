# Vibe Coder Prompt Builder

A 17-step wizard that turns your project idea into three production-ready AI artifacts:

1. **`SKILL.md`** — Drop into Claude's `.claude/skills/` folder. Complete build instructions with pinned versions, file layout, security defaults, and Definition of Done.
2. **`.cursorrules`** — Place at the root of your Cursor project for framework-aware coding rules.
3. **`Master Prompt`** — Paste into any other AI assistant (ChatGPT, Windsurf, Aider, etc.) for a deterministic build.

## ✨ Features

- **Conflict-free output** — A compatibility engine prevents contradictory choices (e.g., Next.js + Django backend, pgvector + MySQL, Stripe without E2E tests).
- **Framework-aware scripts** — `package.json` scripts match the chosen frontend (Vite vs. Next.js vs. Remix vs. Angular, etc.).
- **Smart defaults** — Frontend hosting, payment providers, storage, and E2E testing are auto-picked when professional features require them.
- **Bilingual UI** — Full Arabic (RTL) and English (LTR) with one-click toggle.
- **Mobile-responsive** — Works on phone, tablet, and desktop.
- **Keyboard shortcuts** — `/` to search, `↑↓` to navigate, `Enter` to select, `1-9` for quick-pick.
- **Offline-first** — Zero API keys, all generation runs locally in your browser.

## 🚀 Stack

- **Next.js 15** (App Router) + **React 19 RC**
- **TypeScript** strict mode
- **Tailwind CSS** + **shadcn/ui** primitives
- **Radix UI** + **Lucide** icons
- **localStorage** for wizard persistence

## 📦 Getting Started

```bash
# Install dependencies (uses pnpm — recommended)
pnpm install

# Run development server
pnpm dev
# → http://localhost:3000

# Production build
pnpm build
pnpm start
```

## 🧩 Project Structure

```
src/
├── app/                 # Next.js App Router (page.tsx, layout.tsx)
├── components/
│   ├── ui/              # shadcn primitives (button, card, dialog, ...)
│   ├── wizard/          # 17 step components + context + nav
│   └── CatalogPicker.tsx
├── lib/
│   ├── catalog/         # 250+ options (frameworks, DBs, hosting, ...)
│   ├── compatibility.ts # 13 cascade rules
│   ├── filter.ts        # Hides incompatible options upstream
│   ├── validator.ts     # Post-generation contradiction detector
│   ├── skill-generator.ts
│   └── i18n.ts          # AR + EN strings
└── types/               # Strict TypeScript unions
```

## 🌐 Deploying to Vercel

1. Push to GitHub (see below).
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import the repository — Vercel auto-detects Next.js.
4. Click **Deploy** — no env vars needed.

## 🛡️ Security

This app runs **entirely in the browser**. No project data ever leaves your device. The generated outputs are static Markdown / config files.

## 📄 License

MIT