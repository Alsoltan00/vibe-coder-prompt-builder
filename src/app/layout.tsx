import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vibe Coder Prompt Builder',
  description:
    'Turn your idea into a production-grade, build-ready Skill for Claude, Cursor, ChatGPT, and Windsurf — with zero ambiguity.',
  authors: [{ name: 'Vibe Coder Builder' }],
  keywords: ['prompt', 'skill', 'claude', 'cursor', 'ai', 'builder', 'spec'],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/*
          Belt-and-braces: scrub any leftover wizard state from older builds so the
          field always opens blank, even if the user has the page cached.
          Runs BEFORE React hydrates, so the wizard's first render is fresh.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(k.indexOf('vcpb')===0||k.indexOf('vibe-coder')===0))localStorage.removeItem(k);}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        {children}
      </body>
    </html>
  );
}