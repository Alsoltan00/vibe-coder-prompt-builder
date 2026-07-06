/**
 * Output Validator — Exhaustive SKILL.md contradiction detector
 * Generates SKILL.md for 10+ diverse scenarios and validates zero contradictions.
 * Inspired by create-t3-app's matrix testing approach.
 */
import { SkillGenerator } from '../src/lib/skill-generator';
import type { ProjectData } from '../src/types';

// =====================================================================
//   Scenario Factory — creates fully-typed ProjectData for each test
// =====================================================================

function makeProject(overrides: Partial<any>): ProjectData {
  const base: ProjectData = {
    identity: {
      name: 'test-project',
      projectType: 'web-app',
      targetAudience: 'general users',
      description: 'test project',
    },
    language: 'typescript',
    stack: {
      frontend: 'nextjs',
      backend: 'none',
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
        backend: 'none',
        database: 'neon',
        cdn: 'none',
        orchestration: 'none',
      },
      auth: { primary: 'none', socialProviders: [] },
      thirdParty: {
        payments: 'none', email: 'none', sms: 'none',
        analytics: 'none', monitoring: 'none', storage: 'none',
        search: 'none', featureFlags: 'none',
      },
      design: {
        cssFramework: 'tailwind', componentLibrary: 'none',
        iconSet: 'none', fontFamily: 'none',
      },
      i18n: {
        supportedLocales: ['en'], defaultLocale: 'en',
        rtlSupport: false, translationSource: 'none',
      },
      testing: {
        unit: 'vitest', component: 'none', e2e: 'playwright',
        api: 'none', coverageTarget: 80,
      },
      devops: {
        ci: 'github-actions', cd: 'none', iac: 'none',
        packageManager: 'pnpm', monorepo: 'none',
      },
    },
    professionalRequirements: {
      userAccounts: false, sensitiveData: false, adminPanel: false,
      mobileResponsive: false, realTimeFeatures: false, fileUploads: false,
      payments: false, searchFeature: false, analytics: false, multiLanguage: false,
    },
  };

  // Deep merge
  const merged = JSON.parse(JSON.stringify(base));
  if (overrides.identity) Object.assign(merged.identity, overrides.identity);
  if (overrides.language) merged.language = overrides.language;
  if (overrides.stack) {
    if (overrides.stack.frontend) merged.stack.frontend = overrides.stack.frontend;
    if (overrides.stack.backend) merged.stack.backend = overrides.stack.backend;
    if (overrides.stack.database) Object.assign(merged.stack.database, overrides.stack.database);
    if (overrides.stack.hosting) Object.assign(merged.stack.hosting, overrides.stack.hosting);
    if (overrides.stack.testing) Object.assign(merged.stack.testing, overrides.stack.testing);
    if (overrides.stack.devops) Object.assign(merged.stack.devops, overrides.stack.devops);
    if (overrides.stack.auth) Object.assign(merged.stack.auth, overrides.stack.auth);
    if (overrides.stack.thirdParty) Object.assign(merged.stack.thirdParty, overrides.stack.thirdParty);
  }
  if (overrides.professionalRequirements) {
    Object.assign(merged.professionalRequirements, overrides.professionalRequirements);
  }
  return merged;
}

// =====================================================================
//   Scenarios
// =====================================================================

const scenarios: { name: string; data: ProjectData; checks: ((output: string) => string | null)[] }[] = [
  {
    name: 'Tauri + Jest + MySQL (Desktop)',
    data: makeProject({
      identity: { name: 'اصيل', projectType: 'desktop-app' },
      stack: {
        frontend: 'tauri',
        backend: 'express',
        database: { primary: 'mysql' },
        hosting: { backend: 'railway', database: 'planetscale' },
        testing: { unit: 'jest', e2e: 'playwright' },
        devops: { ci: 'gitlab-ci' },
        thirdParty: { monitoring: 'sentry' },
      },
    }),
    checks: [
      (o) => o.includes('vitest') ? 'CONTRADICTION: "vitest" found in Tauri+Jest project' : null,
      (o) => !o.includes('jest') ? 'MISSING: "jest" should appear in Tauri+Jest project' : null,
      (o) => !o.includes('cargo tauri') ? 'MISSING: "cargo tauri" should appear for Tauri desktop' : null,
      (o) => o.includes('Preview deployment works') ? 'CONTRADICTION: "Preview deployment" in desktop app' : null,
      (o) => !o.includes('Trust boundary') ? 'MISSING: Desktop apps must have Trust boundary' : null,
      (o) => !o.includes('tauri.conf.json') ? 'MISSING: Tauri desktop should generate tauri.conf.json' : null,
      (o) => !o.includes('.gitlab-ci.yml') ? 'MISSING: GitLab CI file reference' : null,
    ],
  },
  {
    name: 'Electron + Jest + SQLite (Desktop)',
    data: makeProject({
      identity: { name: 'electron-app', projectType: 'desktop-app' },
      stack: {
        frontend: 'electron',
        backend: 'none',
        database: { primary: 'sqlite' },
        hosting: { frontend: 'none', backend: 'none', database: 'none' },
        testing: { unit: 'jest' },
      },
    }),
    checks: [
      (o) => o.includes('vitest') ? 'CONTRADICTION: "vitest" found in Electron+Jest project' : null,
      (o) => !o.includes('jest') ? 'MISSING: "jest" should appear' : null,
      (o) => o.includes('Preview deployment works') ? 'CONTRADICTION: "Preview deployment" in desktop app' : null,
      (o) => !o.includes('Trust boundary') ? 'MISSING: Desktop apps must have Trust boundary' : null,
      (o) => !o.includes('forge.config') ? 'MISSING: Electron should generate forge.config' : null,
    ],
  },
  {
    name: 'Next.js + Vitest + PostgreSQL (Web App)',
    data: makeProject({
      identity: { name: 'web-app' },
      stack: {
        frontend: 'nextjs',
        database: { primary: 'postgresql' },
        hosting: { frontend: 'vercel', database: 'neon' },
        testing: { unit: 'vitest' },
        thirdParty: { payments: 'stripe' },
      },
      professionalRequirements: { payments: true },
    }),
    checks: [
      (o) => o.includes('jest') && !o.includes('vitest') ? 'CONTRADICTION: "jest" without "vitest" in vitest project' : null,
      (o) => !o.includes('vitest') ? 'MISSING: "vitest" should appear' : null,
      (o) => !o.includes('env.ts') || !o.includes('createEnv') ? 'MISSING: env.ts with createEnv should be generated' : null,
      (o) => !o.includes('STRIPE_SECRET_KEY') ? 'MISSING: Stripe env var in env.ts' : null,
      (o) => !o.includes('DATABASE_URL') ? 'MISSING: DATABASE_URL in env.ts' : null,
      (o) => !o.includes('Preview deployment works') ? 'MISSING: Web app should have Preview deployment in DoD' : null,
    ],
  },
  {
    name: 'Django + pytest + PostgreSQL (Web App)',
    data: makeProject({
      identity: { name: 'django-app' },
      language: 'python',
      stack: {
        frontend: 'none',
        backend: 'django',
        database: { primary: 'postgresql' },
        hosting: { backend: 'railway', database: 'neon' },
        testing: { unit: 'pytest' },
        devops: { packageManager: 'poetry' },
      },
    }),
    checks: [
      (o) => o.includes('vitest') ? 'CONTRADICTION: "vitest" in Python project' : null,
      (o) => o.includes('jest') ? 'CONTRADICTION: "jest" in Python project' : null,
      (o) => !o.includes('pytest') ? 'MISSING: "pytest" should appear' : null,
      (o) => !o.includes('ruff') ? 'MISSING: "ruff" linter for Python' : null,
    ],
  },
  {
    name: 'Expo + Jest + MongoDB (Mobile)',
    data: makeProject({
      identity: { name: 'mobile-app', projectType: 'mobile-app' },
      stack: {
        frontend: 'expo',
        backend: 'express',
        database: { primary: 'mongodb' },
        hosting: { backend: 'railway', database: 'mongodb-atlas' },
        testing: { unit: 'jest' },
      },
    }),
    checks: [
      (o) => o.includes('vitest') ? 'CONTRADICTION: "vitest" in mobile+jest project' : null,
      (o) => !o.includes('jest') ? 'MISSING: "jest" should appear' : null,
      (o) => o.includes('Preview deployment works') ? 'CONTRADICTION: "Preview deployment" in mobile app' : null,
      (o) => !o.includes('app.json') ? 'MISSING: Mobile project should generate app.json' : null,
    ],
  },
  {
    name: 'SvelteKit + Vitest + Supabase (Web App)',
    data: makeProject({
      identity: { name: 'svelte-app' },
      stack: {
        frontend: 'sveltekit',
        database: { primary: 'supabase-db' },
        hosting: { frontend: 'vercel', database: 'supabase' },
        testing: { unit: 'vitest' },
        auth: { primary: 'supabase-auth', socialProviders: [] },
      },
    }),
    checks: [
      (o) => !o.includes('vitest') ? 'MISSING: "vitest" should appear' : null,
      (o) => !o.includes('RLS') ? 'MISSING: Supabase should have RLS rule' : null,
    ],
  },
  {
    name: 'FastAPI + pytest + MongoDB (API-only)',
    data: makeProject({
      identity: { name: 'api-service', projectType: 'web-app' },
      language: 'python',
      stack: {
        frontend: 'none',
        backend: 'fastapi',
        database: { primary: 'mongodb' },
        hosting: { backend: 'railway', database: 'mongodb-atlas' },
        testing: { unit: 'pytest' },
      },
    }),
    checks: [
      (o) => o.includes('vitest') ? 'CONTRADICTION: "vitest" in Python project' : null,
      (o) => !o.includes('pytest') ? 'MISSING: "pytest" should appear' : null,
      (o) => !o.includes('uvicorn') ? 'MISSING: "uvicorn" for FastAPI' : null,
    ],
  },
  {
    name: 'Tauri + Vitest + PostgreSQL (Desktop)',
    data: makeProject({
      identity: { name: 'tauri-vitest', projectType: 'desktop-app' },
      stack: {
        frontend: 'tauri',
        backend: 'fastify',
        database: { primary: 'postgresql' },
        hosting: { backend: 'railway', database: 'neon' },
        testing: { unit: 'vitest' },
      },
    }),
    checks: [
      (o) => !o.includes('vitest') ? 'MISSING: "vitest" should appear for vitest choice' : null,
      (o) => !o.includes('cargo tauri') ? 'MISSING: "cargo tauri" for Tauri' : null,
      (o) => !o.includes('Trust boundary') ? 'MISSING: Desktop Trust boundary' : null,
      (o) => !o.includes('tauri.conf.json') ? 'MISSING: tauri.conf.json config' : null,
    ],
  },
];

// =====================================================================
//   Runner
// =====================================================================

let totalPassed = 0;
let totalFailed = 0;
const failures: string[] = [];

console.log('── Output Validator (Exhaustive Contradiction Detector) ──\n');

for (const scenario of scenarios) {
  const gen = new SkillGenerator();
  let output: string;
  try {
    output = gen.generate(scenario.data).skill;
  } catch (e: any) {
    console.log(`  ✗ ${scenario.name}: GENERATION FAILED — ${e.message}`);
    totalFailed += scenario.checks.length;
    failures.push(`${scenario.name}: Generation failed`);
    continue;
  }

  let scenarioFailed = false;
  for (const check of scenario.checks) {
    const error = check(output);
    if (error) {
      console.log(`  ✗ ${scenario.name}: ${error}`);
      failures.push(`${scenario.name}: ${error}`);
      totalFailed++;
      scenarioFailed = true;
    } else {
      totalPassed++;
    }
  }
  if (!scenarioFailed) {
    console.log(`  ✓ ${scenario.name} (${scenario.checks.length} checks passed)`);
  }
}

console.log(`\n── Summary ──`);
console.log(`  ${totalPassed} passed, ${totalFailed} failed`);
if (failures.length > 0) {
  console.log(`\n── Failures ──`);
  for (const f of failures) {
    console.log(`  • ${f}`);
  }
  process.exit(1);
}

