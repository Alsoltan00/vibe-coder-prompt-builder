'use client';
import { Globe } from 'lucide-react';
import type { UiLocale } from '@/types';

interface Props {
  locale: UiLocale;
  onChange: (l: UiLocale) => void;
}

export function LanguageSwitcher({ locale, onChange }: Props) {
  return (
    <button
      onClick={() => onChange(locale === 'ar' ? 'en' : 'ar')}
      className="inline-flex items-center gap-1.5 px-2.5 h-8 text-xs rounded-md border bg-background hover:bg-muted transition-colors"
      aria-label="Toggle language"
    >
      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
      <span className="font-medium">{locale === 'ar' ? 'EN' : 'AR'}</span>
    </button>
  );
}