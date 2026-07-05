'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import { languages, frontends, backends } from '@/lib/catalog/core';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { t as tr } from '@/lib/i18n';
import {
  filterFrontends,
  filterBackends,
  filterLanguages,
} from '@/lib/filter';

export function LanguageStep() {
  const wizard = useWizard();
  const filter = filterLanguages(languages as any, wizard.data.stack.frontend, wizard.data.stack.backend);
  return (
    <Step
      catalog={filter.catalog}
      value={wizard.data.language}
      onChange={(v) => wizard.setLanguage(v as any)}
      stepId="language"
      excluded={filter.excluded}
    />
  );
}

export function FrontendStep() {
  const wizard = useWizard();
  const filter = filterFrontends(frontends as any, wizard.data.identity.projectType);
  return (
    <Step
      catalog={filter.catalog}
      value={wizard.data.stack.frontend}
      onChange={(v) => wizard.setStack('frontend', v as any)}
      stepId="frontend"
      excluded={filter.excluded}
    />
  );
}

export function BackendStep() {
  const wizard = useWizard();
  const filter = filterBackends(
    backends as any,
    wizard.data.stack.frontend,
    wizard.data.identity.projectType,
  );
  return (
    <Step
      catalog={filter.catalog}
      value={wizard.data.stack.backend}
      onChange={(v) => wizard.setStack('backend', v as any)}
      stepId="backend"
      excluded={filter.excluded}
    />
  );
}

function Step<TId extends string>(props: {
  catalog: any[];
  value: TId | '' | TId[];
  onChange: (v: TId | '' | TId[]) => void;
  stepId: keyof ReturnType<typeof tr>['steps'];
  excluded?: Record<string, string>;
}) {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const step = t.steps[props.stepId as keyof typeof t.steps] as { title: string; description: string; hint?: string };
  return (
    <div className="space-y-4">
      <StepHeader title={step.title} description={step.description} hint={step.hint} />
      <CatalogPicker
        catalog={props.catalog}
        value={props.value}
        onChange={props.onChange}
        locale={wizard.locale}
        excluded={props.excluded}
      />
    </div>
  );
}