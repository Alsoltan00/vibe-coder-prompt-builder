'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { WizardProvider, useWizard, STEP_ORDER } from '@/components/wizard/context';
import { ProgressBar } from '@/components/wizard/ProgressBar';
import { CompatibilityBar } from '@/components/wizard/CompatibilityBar';
import { LanguageSwitcher } from '@/components/wizard/LanguageSwitcher';
import { evaluateCompatibility, hasBlocker } from '@/lib/compatibility';
import { t as tr, isRtl } from '@/lib/i18n';
import { WelcomeStep } from '@/components/wizard/steps/WelcomeStep';
import { ProjectTypeStep } from '@/components/wizard/steps/ProjectTypeStep';
import { IdentityStep } from '@/components/wizard/steps/IdentityStep';
import { FeaturesStep } from '@/components/wizard/steps/FeaturesStep';
import { LanguageStep, FrontendStep, BackendStep } from '@/components/wizard/steps/TechSteps';
import { DatabaseStep } from '@/components/wizard/steps/DatabaseStep';
import { HostingStep } from '@/components/wizard/steps/HostingStep';
import { AuthStep } from '@/components/wizard/steps/AuthStep';
import { DesignStep } from '@/components/wizard/steps/DesignStep';
import { I18nStep } from '@/components/wizard/steps/I18nStep';
import { ThirdPartyStep } from '@/components/wizard/steps/ThirdPartyStep';
import { TestingStep } from '@/components/wizard/steps/TestingStep';
import { DevOpsStep } from '@/components/wizard/steps/DevOpsStep';
import { ProfessionalStep } from '@/components/wizard/steps/ProfessionalStep';
import { AdditionalStep } from '@/components/wizard/steps/AdditionalStep';
import { GenerateStep } from '@/components/wizard/steps/GenerateStep';
import type { WizardStepId } from '@/types';

function WizardContent() {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const containerRef = useRef<HTMLDivElement>(null);

  // Global keyboard shortcuts: Ctrl/⌘+Enter = next, Esc = prev
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const inField = target.matches('input, textarea, [contenteditable]');
      if (e.key === 'Escape') {
        e.preventDefault();
        wizard.prev();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'Enter' || e.key === '\n')) {
        e.preventDefault();
        wizard.next();
        return;
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [wizard]);

  // Live compatibility check
  const issues = useMemo(() => evaluateCompatibility(wizard.data), [wizard.data]);
  const blocker = hasBlocker(issues);

  const stepId = STEP_ORDER[wizard.stepIdx];
  const visibleSteps = STEP_ORDER.slice(1); // skip welcome
  const currentVisible = Math.max(0, wizard.stepIdx - 1);

  // Pre-resolve next/prev handlers at the component level (so step components don't need props)
  const stepProps = useMemo(
    () => ({
      onNext: wizard.next,
      onPrev: wizard.prev,
    }),
    [wizard],
  );

  return (
    <div ref={containerRef} className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-3">
          <button
            onClick={wizard.restart}
            className="text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent"
          >
            {t.appName}
          </button>
          <div className="flex items-center gap-2">
            {wizard.stepIdx > 0 && wizard.stepIdx < STEP_ORDER.length && (
              <button
                onClick={wizard.restart}
                className="text-xs text-muted-foreground hover:text-foreground hidden sm:inline"
              >
                {t.nav.restart}
              </button>
            )}
            <LanguageSwitcher locale={wizard.locale} onChange={wizard.setLocale} />
          </div>
        </div>
      </header>

      {/* Progress */}
      {wizard.stepIdx > 0 && wizard.stepIdx < STEP_ORDER.length && (
        <div className="container mx-auto px-4 pt-4">
          <ProgressBar currentStep={currentVisible} totalSteps={visibleSteps.length} locale={wizard.locale} />
        </div>
      )}

      {/* Compatibility alerts */}
      {wizard.stepIdx > 0 && issues.length > 0 && (
        <div className="container mx-auto px-4 pt-4">
          <CompatibilityBar issues={issues} locale={wizard.locale} />
        </div>
      )}

      {/* Step content */}
      <main className="container mx-auto px-4 py-6 pb-32 max-w-5xl">
        <div key={stepId} className="animate-fade-in">
          {stepId && (
            <StepRouter stepId={stepId} stepProps={stepProps} />
          )}
        </div>
      </main>

      {/* Sticky nav */}
      {wizard.stepIdx > 0 && wizard.stepIdx < STEP_ORDER.length - 1 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur-md">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3 max-w-5xl">
            <button
              onClick={wizard.prev}
              disabled={wizard.stepIdx === 1}
              className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
            >
              ← {t.nav.back}
            </button>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground hidden md:flex">
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">Esc</kbd>
              <span>back</span>
              <span className="mx-2">·</span>
              <kbd className="px-1.5 py-0.5 rounded border bg-muted">⌘/Ctrl+↵</kbd>
              <span>next</span>
            </div>
            <button
              onClick={wizard.next}
              disabled={blocker}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t.nav.next} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// All step components use `useWizard()` internally — no props needed.
// We only pass props to Welcome (which takes onNext) and ProjectType (which takes onNext + onPrev).
function StepRouter({
  stepId,
  stepProps,
}: {
  stepId: WizardStepId;
  stepProps: { onNext: () => boolean; onPrev: () => void };
}) {
  // Welcome gets special props
  if (stepId === 'welcome') return <WelcomeStep onNext={stepProps.onNext} />;
  // Project-type gets special props
  if (stepId === 'project-type')
    return <ProjectTypeStep onNext={stepProps.onNext} onPrev={stepProps.onPrev} />;
  // All other steps use useWizard() directly
  switch (stepId) {
    case 'identity': return <IdentityStep />;
    case 'features': return <FeaturesStep />;
    case 'language': return <LanguageStep />;
    case 'frontend': return <FrontendStep />;
    case 'backend': return <BackendStep />;
    case 'database': return <DatabaseStep />;
    case 'hosting': return <HostingStep />;
    case 'auth': return <AuthStep />;
    case 'design': return <DesignStep />;
    case 'i18n': return <I18nStep />;
    case 'third-party': return <ThirdPartyStep />;
    case 'testing': return <TestingStep />;
    case 'devops': return <DevOpsStep />;
    case 'professional': return <ProfessionalStep />;
    case 'additional': return <AdditionalStep />;
    case 'generate': return <GenerateStep />;
    default: return null;
  }
}

export default function WizardPage() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}