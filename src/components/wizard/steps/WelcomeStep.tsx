'use client';
import { Sparkles, Layers, Cpu, Globe, Shield, Wand2, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWizard } from '@/components/wizard/context';
import { t as tr } from '@/lib/i18n';

const ICONS = [Sparkles, Layers, Cpu, Globe, Shield, Wand2];

export function WelcomeStep({ onNext }: { onNext: () => void }) {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const w = t.welcome;

  return (
    <div className="max-w-4xl mx-auto text-center pt-6 sm:pt-12">
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-2xl shadow-violet-500/40 mb-6">
        <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
      </div>
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-violet-400 via-fuchsia-400 to-violet-300 bg-clip-text text-transparent">
        {w.heading}
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
        {w.subheading}
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-10">
        {w.features.slice(0, 6).map((f, i) => {
          const Cmp = ICONS[i] ?? Sparkles;
          return (
            <Card key={i} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-3 sm:p-4 text-center">
                <Cmp className="h-5 w-5 text-primary mx-auto mb-1.5" />
                <p className="text-xs sm:text-sm font-medium leading-tight">{f}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button size="xl" variant="gradient" onClick={onNext} className="mb-12 text-base sm:text-lg px-10">
        {w.start}
      </Button>

      <div className="border rounded-xl p-4 sm:p-6 bg-muted/30 max-w-2xl mx-auto text-start">
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Keyboard className="h-4 w-4" /> {w.shortcutsLabel}
        </h3>
        <ul className="space-y-2 text-sm">
          {w.shortcuts.map((s) => (
            <li key={s.key} className="flex items-center justify-between gap-3">
              <kbd className="px-2 py-0.5 text-xs rounded border bg-background font-mono shrink-0">
                {s.key}
              </kbd>
              <span className="text-muted-foreground text-end">{s.action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}