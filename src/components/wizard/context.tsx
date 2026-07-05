'use client';
import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import type {
  ProjectData, UiLocale, WizardStepId, ProjectIdentity,
  LanguageId, FrontendId, BackendId, DatabaseStack, HostingStack,
  AuthStack, DesignSystem, I18nStack, ThirdPartyStack, TestingStack,
  DevOpsStack, ProfessionalRequirements, SocialProviderId, LocaleId,
  TranslationSourceId,
} from '@/types';
import { autoFix } from '@/lib/compatibility';

const STORAGE_KEY = 'vcpb:v3';

const STEP_IDS: WizardStepId[] = [
  'welcome', 'project-type', 'identity', 'features', 'language',
  'frontend', 'backend', 'database', 'hosting', 'auth', 'design',
  'i18n', 'third-party', 'testing', 'devops', 'professional',
  'additional', 'generate',
];

function defaultData(): ProjectData {
  return {
    identity: { name: '', description: '', targetAudience: '', projectType: '' },
    language: '',
    coreFeatures: [],
    stack: {
      frontend: '' as FrontendId,
      backend: '' as BackendId,
      database: {
        primary: 'none' as any, cache: 'none' as any, vector: 'none' as any,
        search: 'none' as any, analytics: 'none' as any, graph: 'none' as any,
        timeseries: 'none' as any,
      },
      hosting: {
        frontend: 'none' as any, backend: 'none' as any, database: 'none' as any,
        cdn: 'none' as any, orchestration: 'none' as any,
      },
      auth: {
        primary: '', socialProviders: [], enterpriseSso: false, mfaRequired: false,
      },
      design: {
        cssFramework: 'none' as any, componentLibrary: 'none' as any,
        iconSet: 'none' as any, fontFamily: 'system-default' as any,
        designTokens: false,
      },
      i18n: {
        enabled: false, defaultLocale: 'en', supportedLocales: ['en'],
        rtlSupport: false, translationSource: 'local-json' as any,
      },
      thirdParty: {
        payments: 'none' as any, email: 'none' as any, sms: 'none' as any,
        analytics: 'none' as any, monitoring: 'none' as any, storage: 'none' as any,
        search: 'none' as any, featureFlags: 'none' as any,
      },
      testing: {
        unit: 'vitest' as any, component: 'none' as any, e2e: 'none' as any,
        api: 'none' as any, visualRegression: false, loadTesting: false,
        securityScanning: false, coverageTarget: 80,
      },
      devops: {
        ci: 'github-actions' as any, cd: 'vercel-deploy' as any, iac: 'none' as any,
        packageManager: 'pnpm' as any, monorepo: 'none' as any,
      },
    },
    professionalRequirements: {
      userAccounts: false, sensitiveData: false, adminPanel: false,
      mobileResponsive: false, realTimeFeatures: false, fileUploads: false,
      payments: false, searchFeature: false, analytics: false, multiLanguage: false,
    },
    additionalRequirements: [],
  };
}

interface WizardState {
  stepIdx: number;
  data: ProjectData;
  locale: UiLocale;
  setLocale: (l: UiLocale) => void;
  next: () => boolean; // returns false if blocked by compatibility
  prev: () => void;
  goto: (id: WizardStepId) => void;
  restart: () => void;
  setIdentity: (patch: Partial<ProjectIdentity>) => void;
  setLanguage: (id: LanguageId | '') => void;
  setFeatures: (features: string[]) => void;
  setStack: <K extends keyof ProjectData['stack']>(key: K, val: ProjectData['stack'][K]) => void;
  setAdditionalReqs: (arr: string[]) => void;
  setProfessionalReqs: (pr: ProfessionalRequirements) => void;
}

const WizardContext = createContext<WizardState | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside <WizardProvider>');
  return ctx;
}

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const value = useWizardProviderInner();
  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
}

function useWizardProviderInner() {
  const [stepIdx, setStepIdx] = useState(0);
  const [locale, setLocaleState] = useState<UiLocale>(() => {
    if (typeof window === 'undefined') return 'ar';
    const saved = localStorage.getItem('vcpb:locale');
    return saved === 'en' || saved === 'ar' ? saved : 'ar';
  });
  const [data, setData] = useState<ProjectData>(() => {
    if (typeof window === 'undefined') return defaultData();
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...defaultData(), ...JSON.parse(saved) } as ProjectData;
    } catch { /* ignore corrupted storage */ }
    return defaultData();
  });

  // Persist
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch { /* quota */ }
  }, [data]);
  useEffect(() => {
    try { localStorage.setItem('vcpb:locale', locale); } catch { /* noop */ }
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    }
  }, [locale]);

  const setLocale = useCallback((l: UiLocale) => setLocaleState(l), []);

  const next = useCallback((): boolean => {
    setStepIdx((i) => Math.min(i + 1, STEP_IDS.length - 1));
    return true;
  }, []);
  const prev = useCallback(() => {
    setStepIdx((i) => Math.max(i - 1, 0));
  }, []);
  const goto = useCallback((id: WizardStepId) => {
    const idx = STEP_IDS.indexOf(id);
    if (idx >= 0) setStepIdx(idx);
  }, []);
  const restart = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm(locale === 'ar' ? 'ابدأ من جديد؟' : 'Restart?')) return;
    setData(defaultData());
    setStepIdx(0);
  }, [locale]);

  // Nested setters — every setter auto-fixes the entire state via compatibility rules,
  // guaranteeing the user CANNOT leave the wizard in an inconsistent state.
  const setIdentity = useCallback((patch: Partial<ProjectIdentity>) => {
    setData((p) => autoFix({ ...p, identity: { ...p.identity, ...patch } }));
  }, []);
  const setLanguage = useCallback((id: LanguageId | '') => {
    setData((p) => autoFix({ ...p, language: id }));
  }, []);
  const setFeatures = useCallback((features: string[]) => {
    setData((p) => ({ ...p, coreFeatures: features }));
  }, []);
  const setStack = useCallback(<K extends keyof ProjectData['stack']>(key: K, val: ProjectData['stack'][K]) => {
    setData((p) => autoFix({ ...p, stack: { ...p.stack, [key]: val } }));
  }, []);
  const setAdditionalReqs = useCallback((arr: string[]) => {
    setData((p) => ({ ...p, additionalRequirements: arr }));
  }, []);
  const setProfessionalReqs = useCallback((pr: ProfessionalRequirements) => {
    setData((p) => autoFix({ ...p, professionalRequirements: pr }));
  }, []);

  return {
    stepIdx, data, locale, setLocale,
    next, prev, goto, restart,
    setIdentity, setLanguage, setFeatures, setStack,
    setAdditionalReqs, setProfessionalReqs,
  };
}

export const STEP_ORDER = STEP_IDS;