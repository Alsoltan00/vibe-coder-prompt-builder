'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { t as tr } from '@/lib/i18n';

const SUGGESTIONS_AR = ['تسجيل دخول', 'لوحة إدارة', 'بحث متقدم', 'إشعارات فورية', 'نظام دفع', 'رفع ملفات', 'تحليلات', 'محادثة', 'API عام', 'تكامل Slack'];
const SUGGESTIONS_EN = ['Authentication', 'Admin dashboard', 'Advanced search', 'Push notifications', 'Payment system', 'File uploads', 'Analytics', 'Chat', 'Public API', 'Slack integration'];

export function FeaturesStep() {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const step = t.steps['features'];
  const [draft, setDraft] = useState('');
  const features = wizard.data.coreFeatures;
  const suggestions = wizard.locale === 'ar' ? SUGGESTIONS_AR : SUGGESTIONS_EN;

  const add = (v: string) => {
    const x = v.trim();
    if (!x || features.includes(x)) return;
    wizard.setFeatures([...features, x]);
  };

  return (
    <div className="space-y-6">
      <StepHeader title={step.title} description={step.description} />

      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add(draft);
              setDraft('');
            }
          }}
          placeholder={wizard.locale === 'ar' ? 'اكتب ميزة ثم Enter…' : 'Type a feature then Enter…'}
        />
        <Button onClick={() => { add(draft); setDraft(''); }} variant="outline">
          <Plus className="h-4 w-4" /> {wizard.locale === 'ar' ? 'أضف' : 'Add'}
        </Button>
      </div>

      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-2">
          {wizard.locale === 'ar' ? '💡 اقتراحات سريعة:' : '💡 Quick suggestions:'}
        </p>
        <div className="flex flex-wrap gap-2">
          {suggestions.filter((s) => !features.includes(s)).map((s) => (
            <button
              key={s}
              onClick={() => add(s)}
              className="px-3 py-1 text-xs rounded-full border bg-background hover:bg-muted hover:border-primary transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      </div>

      {features.length === 0 ? (
        <div className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
          {wizard.locale === 'ar' ? 'لم تُضف أي ميزة بعد' : 'No features added yet'}
        </div>
      ) : (
        <ul className="space-y-2">
          {features.map((f) => (
            <li key={f} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border">
              <span className="text-sm">{f}</span>
              <button
                onClick={() => wizard.setFeatures(features.filter((x) => x !== f))}
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}