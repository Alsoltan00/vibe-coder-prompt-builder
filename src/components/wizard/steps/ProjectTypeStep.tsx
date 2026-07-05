'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import { projectTypes } from '@/lib/catalog/core';
import { useWizard } from '@/components/wizard/context';
import { t as tr } from '@/lib/i18n';

export function ProjectTypeStep({ onNext }: { onNext: () => void; onPrev: () => void }) {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const step = t.steps['project-type'];

  return (
    <div className="space-y-4">
      <StepHeader title={step.title} description={step.description} hint={step.hint} />
      <CatalogPicker
        catalog={projectTypes}
        value={wizard.data.identity.projectType}
        onChange={(v) => wizard.setIdentity({ projectType: v as any })}
        locale={wizard.locale}
      />
    </div>
  );
}

import { useEffect } from 'react';

export function StepHeader({ title, description, hint }: { title: string; description: string; hint?: string }) {
  return (
    <div className="space-y-1 mb-2">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-sm sm:text-base text-muted-foreground">{description}</p>
      {hint && <p className="text-xs text-primary/80 font-medium mt-1">💡 {hint}</p>}
    </div>
  );
}