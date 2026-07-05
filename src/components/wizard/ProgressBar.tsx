'use client';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { t as tr } from '@/lib/i18n';
import type { UiLocale, WizardStepId } from '@/types';
import { STEP_ORDER } from './context';

interface Props {
  currentStep: number;
  totalSteps: number;
  locale: UiLocale;
}

export function ProgressBar({ currentStep, totalSteps, locale }: Props) {
  const t = tr(locale);
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);
  const currentStepId = STEP_ORDER[currentStep + 1];

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="font-medium text-foreground">
            {t.steps[currentStepId as WizardStepId]?.title ?? ''}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.steps[currentStepId as WizardStepId]?.description ?? ''}
          </p>
        </div>
        <p className="font-mono text-lg font-bold tabular-nums text-primary">
          {percent}%
        </p>
      </div>
      <Progress value={percent} />
    </div>
  );
}