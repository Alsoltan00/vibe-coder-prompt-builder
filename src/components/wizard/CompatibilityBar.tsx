'use client';
import { AlertCircle, CheckCircle2, Info, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { CompatibilityIssue } from '@/lib/compatibility';
import type { UiLocale } from '@/types';
import { t as tr } from '@/lib/i18n';

interface Props {
  issues: CompatibilityIssue[];
  locale: UiLocale;
  onAutoFix?: () => void;
}

export function CompatibilityBar({ issues, locale, onAutoFix }: Props) {
  const t = tr(locale);
  const blockers = issues.filter((i) => i.severity === 'block');
  const warnings = issues.filter((i) => i.severity === 'warn');
  const info = issues.filter((i) => i.severity === 'info');

  if (issues.length === 0) return null;

  return (
    <div className="space-y-2">
      {blockers.map((i) => (
        <Alert key={i.id} variant="destructive" className="items-start">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <div className="flex-1">
            <AlertTitle>{t.compatibility.blockers}</AlertTitle>
            <AlertDescription>{i.message}</AlertDescription>
          </div>
          {onAutoFix && (
            <Button size="sm" variant="gradient" onClick={onAutoFix} className="shrink-0">
              <Wand2 className="h-3.5 w-3.5" /> {t.compatibility.autofix}
            </Button>
          )}
        </Alert>
      ))}
      {warnings.map((i) => (
        <Alert key={i.id} variant="warning" className="items-start">
          <AlertCircle className="h-4 w-4 mt-0.5" />
          <div className="flex-1">
            <AlertTitle>{t.compatibility.warnings}</AlertTitle>
            <AlertDescription>{i.message}</AlertDescription>
          </div>
        </Alert>
      ))}
      {info.map((i) => (
        <Alert key={i.id} variant="info" className="items-start">
          <Info className="h-4 w-4 mt-0.5" />
          <div className="flex-1">
            <AlertTitle>{t.compatibility.info}</AlertTitle>
            <AlertDescription>{i.message}</AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
}