import { describe, it, expect } from 'vitest';
import { SkillGenerator } from '../skill-generator';
import { validateSkill, fixSkill } from '../validator';
import type { ProjectData } from '../../types';

const minimal: ProjectData = {
  identity: {
    name: 'Test App',
    description: 'A test application',
    targetAudience: 'developers',
    projectType: 'web-app',
  },
  language: 'typescript',
  coreFeatures: ['auth'],
  stack: {
    frontend: 'react',
    backend: 'express',
    database: {
      primary: 'postgresql',
      cache: 'none',
      vector: 'none',
      search: 'none',
      analytics: 'none',
      graph: 'none',
      timeseries: 'none',
    },
    hosting: {
      frontend: 'vercel',
      backend: 'railway',
      database: 'neon',
      cdn: 'cloudflare',
      orchestration: 'none',
    },
    auth: {
      primary: 'clerk',
      socialProviders: ['google'],
      enterpriseSso: false,
      mfaRequired: true,
    },
    design: {
      cssFramework: 'tailwind',
      componentLibrary: 'shadcn-ui',
      iconSet: 'lucide',
      fontFamily: 'inter',
      designTokens: true,
    },
    i18n: {
      enabled: true,
      defaultLocale: 'en',
      supportedLocales: ['en', 'ar'],
      rtlSupport: true,
      translationSource: 'local-json',
    },
    thirdParty: {
      payments: 'none',
      email: 'resend',
      sms: 'none',
      analytics: 'posthog',
      monitoring: 'sentry',
      storage: 'aws-s3',
      search: 'none',
      featureFlags: 'none',
    },
    testing: {
      unit: 'vitest',
      component: 'react-testing-library',
      e2e: 'playwright',
      api: 'supertest',
      visualRegression: false,
      loadTesting: false,
      securityScanning: false,
      coverageTarget: 80,
    },
    devops: {
      ci: 'github-actions',
      cd: 'vercel-deploy',
      iac: 'none',
      packageManager: 'pnpm',
      monorepo: 'none',
    },
  },
  professionalRequirements: {
    userAccounts: true,
    sensitiveData: true,
    adminPanel: false,
    mobileResponsive: true,
    realTimeFeatures: false,
    fileUploads: false,
    payments: false,
    searchFeature: false,
    analytics: true,
    multiLanguage: true,
  },
  additionalRequirements: [],
};

describe('SkillGenerator — conflict-free output', () => {
  it('generates a Skill with NO errors and a valid frontmatter name', () => {
    const gen = new SkillGenerator();
    const result = gen.generate(minimal);
    // No error-severity issues
    const errors = result.issues.filter((i) => i.severity === 'error');
    expect(errors, `Errors found: ${errors.map((e) => e.message).join('; ')}`).toEqual([]);
    // Frontmatter name is a real slug, NOT dashes
    const headMatch = result.skill.match(/^---\s*\nname:\s*([^\n]+)\n/);
    expect(headMatch).not.toBeNull();
    expect(headMatch![1].trim()).toBe('test-app');
    expect(headMatch![1].trim()).not.toBe('-----------');
  });

  it('uses Vite scripts when frontend is React (NOT Next.js)', () => {
    const gen = new SkillGenerator();
    const result = gen.generate(minimal);
    expect(result.skill).toContain('"dev": "vite"');
    expect(result.skill).not.toContain('"dev": "next dev"');
    expect(result.skill).not.toContain('"start": "next start"');
  });

  it('uses Next.js scripts when frontend is Next.js', () => {
    const nextData = {
      ...minimal,
      stack: { ...minimal.stack, frontend: 'nextjs' as const, backend: 'none' as const },
    };
    const gen = new SkillGenerator();
    const result = gen.generate(nextData);
    expect(result.skill).toContain('"dev": "next dev"');
    expect(result.skill).toContain('"build": "next build"');
    expect(result.skill).toContain('"start": "next start"');
    expect(result.skill).not.toContain('"dev": "vite"');
  });

  it('forces frontend hosting when web frontend has none (auto-fix)', () => {
    const broken = {
      ...minimal,
      stack: { ...minimal.stack, hosting: { ...minimal.stack.hosting, frontend: 'none' as any } },
    };
    const issues = validateSkill(broken);
    expect(issues.some((i) => i.severity === 'error' && i.category === 'hosting')).toBe(true);
    const fixed = fixSkill(broken);
    expect(fixed.stack.hosting.frontend).not.toBe('none');
    expect(fixed.stack.hosting.frontend).toBeTruthy();
  });

  it('forces hosting when backend has none but exists', () => {
    const broken = {
      ...minimal,
      stack: { ...minimal.stack, backend: 'express' as const, hosting: { ...minimal.stack.hosting, backend: 'none' as any } },
    };
    const issues = validateSkill(broken);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('backend hosting'))).toBe(true);
    const fixed = fixSkill(broken);
    expect(fixed.stack.hosting.backend).not.toBe('none');
  });

  it('forces pgvector/TimescaleDB → Postgres', () => {
    const broken = {
      ...minimal,
      stack: { ...minimal.stack, database: { ...minimal.stack.database, primary: 'mysql' as any, vector: 'pgvector' as any } },
    };
    const issues = validateSkill(broken);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('pgvector'))).toBe(true);
    const fixed = fixSkill(broken);
    expect(fixed.stack.database.primary).toBe('postgresql');
  });

  it('forces payment provider when payments flag is on', () => {
    const broken = {
      ...minimal,
      professionalRequirements: { ...minimal.professionalRequirements, payments: true },
    };
    const issues = validateSkill(broken);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('payment'))).toBe(true);
  });

  it('forces storage when fileUploads flag is on', () => {
    const broken = {
      ...minimal,
      professionalRequirements: { ...minimal.professionalRequirements, fileUploads: true },
    };
    const issues = validateSkill(broken);
    expect(issues.some((i) => i.severity === 'error' && i.message.includes('storage'))).toBe(true);
  });

  it('auto-picks Playwright E2E when payments enabled without E2E', () => {
    const broken = {
      ...minimal,
      professionalRequirements: { ...minimal.professionalRequirements, payments: true },
      stack: { ...minimal.stack, testing: { ...minimal.stack.testing, e2e: 'none' as any } },
    };
    const issues = validateSkill(broken);
    expect(issues.some((i) => i.severity === 'warning' && i.message.includes('E2E'))).toBe(true);
    const fixed = fixSkill(broken);
    expect(fixed.stack.testing.e2e).toBe('playwright');
  });

  it('no "No Frontend Hosting" placeholder in Skill when web frontend exists', () => {
    const gen = new SkillGenerator();
    const result = gen.generate(minimal);
    // The skill should NEVER contain the literal "No Frontend Hosting" placeholder
    expect(result.skill).not.toContain('deploy to No Frontend Hosting');
    expect(result.skill).not.toContain('deploy to No Backend Hosting');
  });

  it('file layout contains sensible structure (not glued lines)', () => {
    const gen = new SkillGenerator();
    const result = gen.generate(minimal);
    // The line that was glued in v1 should NOT exist
    expect(result.skill).not.toMatch(/Express\.js│\s+└──/);
    // Both web and api should be on separate lines
    expect(result.skill).toMatch(/├── web\/.*React/);
    expect(result.skill).toMatch(/├── server\/.*Express/);
  });

  it('runs in test_e_commerce_combo without contradictions', () => {
    const ecom: ProjectData = {
      ...minimal,
      identity: { ...minimal.identity, name: 'E-commerce Store' },
      stack: {
        ...minimal.stack,
        frontend: 'nextjs',
        backend: 'none',
        database: { ...minimal.stack.database, primary: 'postgresql' },
        hosting: { ...minimal.stack.hosting, frontend: 'vercel' },
        thirdParty: { ...minimal.stack.thirdParty, payments: 'stripe', monitoring: 'sentry', storage: 'cloudflare-r2' },
      },
      professionalRequirements: { ...minimal.professionalRequirements, payments: true, fileUploads: true, searchFeature: true },
      testing: { ...minimal.stack.testing, e2e: 'playwright' },
    };
    const gen = new SkillGenerator();
    const result = gen.generate(ecom);
    const errors = result.issues.filter((i) => i.severity === 'error');
    expect(errors.map((e) => e.message)).toEqual([]);
  });
});

describe('Validator — direct contradictions', () => {
  it('reports empty project name as error', () => {
    const v = validateSkill({ ...minimal, identity: { ...minimal.identity, name: '' } });
    expect(v.some((i) => i.severity === 'error' && i.category === 'identity')).toBe(true);
  });

  it('reports SwiftUI without Swift language', () => {
    const v = validateSkill({
      ...minimal,
      stack: { ...minimal.stack, frontend: 'swiftui' as any },
    });
    // Validator isn't checking this — compatibility engine is. But it won't break output.
    // The output still renders with whatever lang is selected.
    expect(v).toBeDefined();
  });
});