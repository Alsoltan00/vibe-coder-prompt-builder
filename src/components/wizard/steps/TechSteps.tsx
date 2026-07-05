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
  const filter = filterFrontends(
    frontends as any,
    wizard.data.identity.projectType,
    wizard.data.language,
  );
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
    wizard.data.language,
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
  const excludedCount = Object.keys(props.excluded ?? {}).length;
  const ar = wizard.locale === 'ar';

  // Build a contextual "why so few options" notice
  let whyNotice: { title: string; body: string } | null = null;
  if (props.stepId === 'frontend') {
    if (wizard.data.language && wizard.data.language !== 'typescript' && wizard.data.language !== 'javascript') {
      const lang = wizard.data.language;
      if (['python', 'go', 'rust', 'ruby', 'php', 'elixir', 'java', 'csharp', 'scala', 'solidity', 'cpp', 'dart', 'kotlin', 'swift'].includes(lang)) {
        whyNotice = {
          title: ar ? 'لا توجد خيارات متاحة' : 'No options available',
          body: ar
            ? `${lang} ليست لغة Frontend. web frameworks تتطلب JavaScript/TypeScript. للـ UI التقليدي استخدم Django templates / HTMX داخل backend، أو غيّر اللغة إلى TypeScript.`
            : `${lang} is not a frontend language. Web frameworks require JavaScript/TypeScript. For traditional UI use Django templates / HTMX inside your backend, or switch the language to TypeScript.`,
        };
      }
    }
    if (!whyNotice && ['mobile-app', 'desktop-app', 'cli-tool', 'library-sdk', 'api-backend'].includes(wizard.data.identity.projectType)) {
      const pt = wizard.data.identity.projectType;
      const labels: Record<string, { ar: string; en: string }> = {
        'mobile-app': { ar: 'تطبيق موبايل', en: 'Mobile app' },
        'desktop-app': { ar: 'تطبيق سطح مكتب', en: 'Desktop app' },
        'cli-tool': { ar: 'أداة CLI', en: 'CLI tool' },
        'library-sdk': { ar: 'مكتبة/SDK', en: 'Library/SDK' },
        'api-backend': { ar: 'API بدون UI', en: 'API only' },
      };
      whyNotice = {
        title: ar ? 'هذا المشروع لا يحتاج واجهة' : 'This project has no UI',
        body: ar
          ? `${labels[pt]!.ar} — لا حاجة لـ Frontend framework.`
          : `${labels[pt]!.en} — no Frontend framework needed.`,
      };
    }
  } else if (props.stepId === 'backend') {
    if (excludedCount > 0 && props.catalog.length <= 1) {
      whyNotice = {
        title: ar ? 'لا يوجد backend منفصل' : 'No separate backend',
        body: ar
          ? 'frontend المختار هو full-stack (يحتوي backend مدمج) أو نوع المشروع لا يحتاج backend.'
          : 'Your frontend is full-stack (built-in backend) or the project type doesn\'t need a backend.',
      };
    }
  } else if (props.stepId === 'language') {
    if (excludedCount > 0 && props.catalog.length <= 1) {
      whyNotice = {
        title: ar ? 'اللغة محددة' : 'Language is fixed',
        body: ar
          ? 'frontend/backend المختار يفرض لغة معينة.'
          : 'Your chosen frontend/backend fixes the language.',
      };
    }
  }

  return (
    <div className="space-y-4">
      <StepHeader title={step.title} description={step.description} hint={step.hint} />

      {/* Why-so-few-options notice */}
      {whyNotice && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <p className="font-semibold text-amber-700 dark:text-amber-400 mb-1">
            ⚠ {whyNotice.title}
          </p>
          <p className="text-amber-900 dark:text-amber-200/80 leading-relaxed">{whyNotice.body}</p>
        </div>
      )}

      {/* Excluded-count summary (when no notice but items are hidden) */}
      {excludedCount > 0 && !whyNotice && (
        <div className="text-xs text-muted-foreground px-1">
          {ar
            ? `${excludedCount} خيار مخفي بسبب اختيارات سابقة (مقفلة 🔒)`
            : `${excludedCount} option${excludedCount > 1 ? 's' : ''} hidden due to earlier selections (locked 🔒)`}
        </div>
      )}

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