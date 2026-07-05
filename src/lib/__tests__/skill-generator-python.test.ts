// Quick e2e test: simulate the user's "جاوبكس" scenario (Django + Python + no UI)
// and verify the generated Skill has zero JS/TS contamination.
import { describe, it, expect } from 'vitest';
import { SkillGenerator } from '../skill-generator';
import type { ProjectData } from '../../types';

const pythonScenario: ProjectData = {
  identity: {
    name: 'جاوبكس',
    description: 'تطبيق ويب عربي لتوليد الأسئلة',
    targetAudience: 'مطورو بايثون',
    projectType: 'web-app',
  },
  language: 'python',
  coreFeatures: ['auth', 'crud'],
  stack: {
    frontend: 'none',
    backend: 'django',
    database: {
      primary: 'mysql',
      cache: 'none',
      vector: 'none',
      search: 'none',
      analytics: 'none',
      graph: 'none',
      timeseries: 'none',
    },
    hosting: {
      frontend: 'railway',
      backend: 'railway',
      database: 'railway',
      cdn: 'none',
      orchestration: 'none',
    },
    auth: {
      primary: 'django-allauth',
      socialProviders: [],
      enterpriseSso: false,
      mfaRequired: false,
    },
    design: {
      cssFramework: 'bootstrap',
      componentLibrary: 'none',
      iconSet: 'lucide',
      fontFamily: 'cairo',
      designTokens: false,
    },
    i18n: {
      enabled: true,
      defaultLocale: 'ar',
      supportedLocales: ['ar', 'en'],
      rtlSupport: true,
      translationSource: 'local-json',
    },
    thirdParty: {
      payments: 'none',
      email: 'smtp',
      sms: 'none',
      analytics: 'none',
      monitoring: 'sentry',
      storage: 'aws-s3',
      search: 'none',
      featureFlags: 'none',
    },
    testing: {
      unit: 'pytest',
      component: 'none',
      e2e: 'none',
      api: 'none',
      visualRegression: false,
      loadTesting: false,
      securityScanning: false,
      coverageTarget: 80,
    },
    devops: {
      ci: 'github-actions',
      cd: 'railway-deploy',
      iac: 'none',
      packageManager: 'pip',
      monorepo: 'none',
    },
  },
  professionalRequirements: {
    userAccounts: true,
    sensitiveData: false,
    adminPanel: true,
    mobileResponsive: true,
    realTimeFeatures: false,
    fileUploads: false,
    payments: false,
    searchFeature: false,
    analytics: false,
    multiLanguage: true,
  },
  additionalRequirements: [],
};

describe('Skill Generator — Django + Python (no UI)', () => {
  it('produces a Python/Django-coherent Skill (no JS idioms)', () => {
    const result = new SkillGenerator().generate(pythonScenario);
    const skill = result.skill;

    // No JS-isms should leak in
    const jsisms: RegExp[] = [
      /\btsconfig\.json\b/i,
      /PascalCase files for components/i,
      /\bstrict mode enabled\b/i,
      /function components \+ hooks/i,
      /\bJSDoc\b/i,
      /\bZod\b/i,
      /\bPrisma\b|\bDrizzle\b/i,
      /\bStorybook\b/i,
      /<div onClick>/i,
      /`@\/`/,
      /\bvitest\b/i,
      /\bpnpm\s+(?:mypy|ruff)/i,
      /\bpnpm\s+(?:pytest|golangci|cargo)/i,
      /\beslint\b/i,
    ];
    for (const pat of jsisms) {
      expect(skill, `Skill should NOT contain ${pat}`).not.toMatch(pat);
    }

    // Python/Django-coherent content must be present
    expect(skill).toMatch(/Django/i);
    expect(skill).toMatch(/pytest/i);
    expect(skill).toMatch(/ruff/i);
    expect(skill).toMatch(/mypy/i);
    expect(skill).toMatch(/pyproject\.toml/i);
    expect(skill).toMatch(/snake_case/);
    expect(skill).toMatch(/test_.*\.py/);
  });

  it('omits Storybook/JSX UI section when frontend is "none"', () => {
    const result = new SkillGenerator().generate(pythonScenario);
    const skill = result.skill;
    // Should mention server-rendered templates / Django templates, not React/Storybook
    expect(skill).toMatch(/templates|Django templates|server-rendered/i);
    expect(skill).not.toMatch(/src\/components\//);
  });

  it('CI/CD section does not use pnpm for Python tools', () => {
    const result = new SkillGenerator().generate(pythonScenario);
    const skill = result.skill;
    // Should not say `pnpm mypy` or `pnpm ruff` or `pnpm pytest`
    expect(skill).not.toMatch(/pnpm\s+mypy/);
    expect(skill).not.toMatch(/pnpm\s+ruff/);
    expect(skill).not.toMatch(/pnpm\s+pytest/);
  });
});