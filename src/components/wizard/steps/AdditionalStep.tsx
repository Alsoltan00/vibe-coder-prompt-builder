'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';

export function AdditionalStep() {
  const wizard = useWizard();
  const list = wizard.data.additionalRequirements;
  const [draft, setDraft] = useState('');

  const add = () => {
    const v = draft.trim();
    if (v && !list.includes(v)) {
      wizard.setAdditionalReqs([...list, v]);
      setDraft('');
    }
  };

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'تفاصيل إضافية' : 'Additional Notes'}
        description={wizard.locale === 'ar' ? 'أي متطلبات أو قيود لم تُذكر' : 'Any requirements or constraints not covered above'}
      />
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          placeholder={wizard.locale === 'ar' ? 'مثلاً: التطبيق يعمل في بيئة بدون إنترنت' : 'e.g., must work offline'}
        />
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {list.length > 0 && (
        <ul className="space-y-2">
          {list.map((item) => (
            <li key={item} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <span className="text-sm">{item}</span>
              <button onClick={() => wizard.setAdditionalReqs(list.filter((x) => x !== item))}>
                <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}