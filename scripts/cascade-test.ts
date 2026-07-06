// =====================================================================
//   Cascade test — verifies that contradictory selections are
//   auto-resolved via autoFix() and that filter.ts hides the right options.
// =====================================================================

import { evaluateCompatibility, autoFix, hasBlocker } from '../src/lib/compatibility';
import {
  filterFrontends,
  filterBackends,
  filterLanguages,
  filterPrimaryDatabases,
  filterAuthProviders,
  filterE2eTests,
  filterPaymentProviders,
  filterStorageProviders,
  filterPackageManagers,
  filterBackendHostings,
} from '../src/lib/filter';
import {
  frontends, backends, languages, primaryDatabases,
  authProviders, e2eTestTools, paymentProviders, storageProviders,
  packageManagers, backendHostingCatalog,
} from '../src/lib/catalog';

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (e: any) {
    console.log(`  ✗ ${name}`);
    console.log(`     ${e.message}`);
    failed++;
  }
}

function assert(cond: any, msg: string) {
  if (!cond) throw new Error(msg);
}

console.log('── Compatibility engine ──');

test('Python + Express backend is rejected', () => {
  const data: any = {
    identity: { name: 'X', description: '', targetAudience: '', projectType: 'web-app' },
    language: 'python',
    coreFeatures: [],
    stack: {
      frontend: 'react', backend: 'express',
      database: { primary: 'postgresql', cache: 'none', vector: 'none', search: 'none', analytics: 'none', graph: 'none', timeseries: 'none' },
      hosting: { frontend: 'vercel', backend: 'railway', database: 'neon', cdn: 'none', orchestration: 'none' },
      auth: { primary: 'clerk', socialProviders: [], enterpriseSso: false, mfaRequired: false },
      design: { cssFramework: 'tailwind', componentLibrary: 'none', iconSet: 'lucide', fontFamily: 'inter', designTokens: false },
      i18n: { enabled: false, defaultLocale: 'en', supportedLocales: ['en'], rtlSupport: false, translationSource: 'local-json' },
      thirdParty: { payments: 'none', email: 'none', sms: 'none', analytics: 'none', monitoring: 'none', storage: 'none', search: 'none', featureFlags: 'none' },
      testing: { unit: 'vitest', component: 'none', e2e: 'none', api: 'none', visualRegression: false, loadTesting: false, securityScanning: false, coverageTarget: 80 },
      devops: { ci: 'github-actions', cd: 'vercel-deploy', iac: 'none', packageManager: 'pnpm', monorepo: 'none' },
    },
    professionalRequirements: { userAccounts: false, sensitiveData: false, adminPanel: false, mobileResponsive: false, realTimeFeatures: false, fileUploads: false, payments: false, searchFeature: false, analytics: false, multiLanguage: false },
    additionalRequirements: [],
  };
  const issues = evaluateCompatibility(data);
  assert(issues.some((i) => i.message.includes('Express requires typescript')), 'Express + Python should error');
  const fixed = autoFix(data);
  const final = evaluateCompatibility(fixed);
  assert(final.length === 0, `After auto-fix, should be 0 issues (got ${final.length})`);
});

test('Mobile app cannot pick React Vite frontend', () => {
  const data: any = {
    identity: { name: 'X', description: '', targetAudience: '', projectType: 'mobile-app' },
    language: 'typescript',
    coreFeatures: [],
    stack: {
      frontend: 'react', backend: 'none',
      database: { primary: 'none', cache: 'none', vector: 'none', search: 'none', analytics: 'none', graph: 'none', timeseries: 'none' },
      hosting: { frontend: 'none', backend: 'none', database: 'none', cdn: 'none', orchestration: 'none' },
      auth: { primary: '', socialProviders: [], enterpriseSso: false, mfaRequired: false },
      design: { cssFramework: 'tailwind', componentLibrary: 'none', iconSet: 'lucide', fontFamily: 'inter', designTokens: false },
      i18n: { enabled: false, defaultLocale: 'en', supportedLocales: ['en'], rtlSupport: false, translationSource: 'local-json' },
      thirdParty: { payments: 'none', email: 'none', sms: 'none', analytics: 'none', monitoring: 'none', storage: 'none', search: 'none', featureFlags: 'none' },
      testing: { unit: 'vitest', component: 'none', e2e: 'none', api: 'none', visualRegression: false, loadTesting: false, securityScanning: false, coverageTarget: 80 },
      devops: { ci: 'github-actions', cd: 'vercel-deploy', iac: 'none', packageManager: 'pnpm', monorepo: 'none' },
    },
    professionalRequirements: { userAccounts: false, sensitiveData: false, adminPanel: false, mobileResponsive: true, realTimeFeatures: false, fileUploads: false, payments: false, searchFeature: false, analytics: false, multiLanguage: false },
    additionalRequirements: [],
  };
  const fixed = autoFix(data);
  assert(['react-native', 'expo', 'flutter', 'swiftui', 'jetpack-compose'].includes(fixed.stack.frontend), `Should snap to mobile frontend, got ${fixed.stack.frontend}`);
});

test('Cloudflare Workers + Express → auto-fix to Hono', () => {
  const data: any = {
    identity: { name: 'X', description: '', targetAudience: '', projectType: 'web-app' },
    language: 'typescript',
    coreFeatures: [],
    stack: {
      frontend: 'react', backend: 'express',
      database: { primary: 'postgresql', cache: 'none', vector: 'none', search: 'none', analytics: 'none', graph: 'none', timeseries: 'none' },
      hosting: { frontend: 'vercel', backend: 'cloudflare-workers', database: 'neon', cdn: 'none', orchestration: 'none' },
      auth: { primary: 'clerk', socialProviders: [], enterpriseSso: false, mfaRequired: false },
      design: { cssFramework: 'tailwind', componentLibrary: 'none', iconSet: 'lucide', fontFamily: 'inter', designTokens: false },
      i18n: { enabled: false, defaultLocale: 'en', supportedLocales: ['en'], rtlSupport: false, translationSource: 'local-json' },
      thirdParty: { payments: 'none', email: 'none', sms: 'none', analytics: 'none', monitoring: 'none', storage: 'none', search: 'none', featureFlags: 'none' },
      testing: { unit: 'vitest', component: 'none', e2e: 'none', api: 'none', visualRegression: false, loadTesting: false, securityScanning: false, coverageTarget: 80 },
      devops: { ci: 'github-actions', cd: 'vercel-deploy', iac: 'none', packageManager: 'pnpm', monorepo: 'none' },
    },
    professionalRequirements: { userAccounts: true, sensitiveData: false, adminPanel: false, mobileResponsive: false, realTimeFeatures: false, fileUploads: false, payments: false, searchFeature: false, analytics: false, multiLanguage: false },
    additionalRequirements: [],
  };
  const fixed = autoFix(data);
  assert(fixed.stack.backend === 'hono', `Should snap to hono, got ${fixed.stack.backend}`);
});

test('pgvector + MySQL → auto-fix primary to postgresql', () => {
  const data: any = {
    identity: { name: 'X', description: '', targetAudience: '', projectType: 'web-app' },
    language: 'typescript',
    coreFeatures: [],
    stack: {
      frontend: 'react', backend: 'express',
      database: { primary: 'mysql', cache: 'none', vector: 'pgvector', search: 'none', analytics: 'none', graph: 'none', timeseries: 'none' },
      hosting: { frontend: 'vercel', backend: 'railway', database: 'aws-rds', cdn: 'none', orchestration: 'none' },
      auth: { primary: 'clerk', socialProviders: [], enterpriseSso: false, mfaRequired: false },
      design: { cssFramework: 'tailwind', componentLibrary: 'none', iconSet: 'lucide', fontFamily: 'inter', designTokens: false },
      i18n: { enabled: false, defaultLocale: 'en', supportedLocales: ['en'], rtlSupport: false, translationSource: 'local-json' },
      thirdParty: { payments: 'none', email: 'none', sms: 'none', analytics: 'none', monitoring: 'none', storage: 'none', search: 'none', featureFlags: 'none' },
      testing: { unit: 'vitest', component: 'none', e2e: 'none', api: 'none', visualRegression: false, loadTesting: false, securityScanning: false, coverageTarget: 80 },
      devops: { ci: 'github-actions', cd: 'vercel-deploy', iac: 'none', packageManager: 'pnpm', monorepo: 'none' },
    },
    professionalRequirements: { userAccounts: false, sensitiveData: false, adminPanel: false, mobileResponsive: false, realTimeFeatures: false, fileUploads: false, payments: false, searchFeature: false, analytics: false, multiLanguage: false },
    additionalRequirements: [],
  };
  const fixed = autoFix(data);
  assert(fixed.stack.database.primary === 'postgresql', `Should fix to postgresql, got ${fixed.stack.database.primary}`);
});

test('Payments on but no provider → auto-fix to stripe', () => {
  const data: any = {
    identity: { name: 'X', description: '', targetAudience: '', projectType: 'web-app' },
    language: 'typescript',
    coreFeatures: [],
    stack: {
      frontend: 'react', backend: 'express',
      database: { primary: 'postgresql', cache: 'none', vector: 'none', search: 'none', analytics: 'none', graph: 'none', timeseries: 'none' },
      hosting: { frontend: 'vercel', backend: 'railway', database: 'neon', cdn: 'none', orchestration: 'none' },
      auth: { primary: 'clerk', socialProviders: [], enterpriseSso: false, mfaRequired: false },
      design: { cssFramework: 'tailwind', componentLibrary: 'none', iconSet: 'lucide', fontFamily: 'inter', designTokens: false },
      i18n: { enabled: false, defaultLocale: 'en', supportedLocales: ['en'], rtlSupport: false, translationSource: 'local-json' },
      thirdParty: { payments: 'none', email: 'none', sms: 'none', analytics: 'none', monitoring: 'none', storage: 'none', search: 'none', featureFlags: 'none' },
      testing: { unit: 'vitest', component: 'none', e2e: 'none', api: 'none', visualRegression: false, loadTesting: false, securityScanning: false, coverageTarget: 80 },
      devops: { ci: 'github-actions', cd: 'vercel-deploy', iac: 'none', packageManager: 'pnpm', monorepo: 'none' },
    },
    professionalRequirements: { userAccounts: true, sensitiveData: false, adminPanel: false, mobileResponsive: false, realTimeFeatures: false, fileUploads: false, payments: true, searchFeature: false, analytics: false, multiLanguage: false },
    additionalRequirements: [],
  };
  const fixed = autoFix(data);
  assert(fixed.stack.thirdParty.payments === 'stripe', `Should fix to stripe, got ${fixed.stack.thirdParty.payments}`);
});

console.log('\n── Filter functions ──');

test('filterLanguages with Express frontend shows only JS/TS languages', () => {
  // Pretend we picked Express backend first
  const result = filterLanguages(languages as any, '', 'express');
  assert(!result.excluded['typescript'], 'typescript should be allowed');
  assert(!result.excluded['javascript'], 'javascript should be allowed');
  assert(!!result.excluded['python'], 'python should be excluded');
  assert(!!result.excluded['go'], 'go should be excluded');
});

test('filterBackends with Next.js hides all non-none backends', () => {
  const result = filterBackends(backends as any, 'nextjs', 'web-app', '');
  assert(result.excluded['express'] !== undefined, 'Express should be excluded with Next.js frontend');
  assert(result.excluded['django'] !== undefined, 'Django should be excluded with Next.js frontend');
  assert(!result.excluded['none'], 'none must be allowed with Next.js frontend');
});

test('filterFrontends for mobile-app hides web frontends', () => {
  const result = filterFrontends(frontends as any, 'mobile-app', '');
  assert(!!result.excluded['react'], 'React should be excluded for mobile-app');
  assert(!!result.excluded['nextjs'], 'Next.js should be excluded for mobile-app');
  assert(!result.excluded['react-native'], 'react-native should be allowed for mobile-app');
  assert(!result.excluded['flutter'], 'flutter should be allowed for mobile-app');
});

test('filterBackends with Python language excludes Node backends', () => {
  const result = filterBackends(backends as any, 'react', 'web-app', 'python');
  assert(!!result.excluded['express'], 'Express should be excluded with Python language');
  assert(!!result.excluded['nestjs'], 'NestJS should be excluded with Python language');
  assert(!result.excluded['fastapi'], 'FastAPI should be allowed with Python language');
  assert(!result.excluded['django'], 'Django should be allowed with Python language');
});

test('filterAuthProviders with Supabase DB prefers supabase-auth', () => {
  const result = filterAuthProviders(authProviders as any, 'nextjs', 'supabase-db', false, false);
  assert(result.pinnedDefault === 'supabase-auth', `Should default to supabase-auth, got ${result.pinnedDefault}`);
});

test('filterPaymentProviders hides providers when payments feature off', () => {
  const result = filterPaymentProviders(paymentProviders as any, false);
  assert(!!result.excluded['stripe'], 'Stripe should be excluded when payments=false');
  assert(!result.excluded['none'], 'none should remain available');
});

test('filterPaymentProviders shows all when payments feature on', () => {
  const result = filterPaymentProviders(paymentProviders as any, true);
  assert(!result.excluded['stripe'], 'Stripe should be available');
  assert(!result.excluded['paypal'], 'PayPal should be available');
});

test('filterStorageProviders hides S3 when fileUploads off', () => {
  const result = filterStorageProviders(storageProviders as any, false, 'postgresql');
  assert(!!result.excluded['aws-s3'], 'S3 should be excluded');
});

test('filterE2eTests hides None when payments enabled', () => {
  const result = filterE2eTests(e2eTestTools as any, true, false);
  assert(!!result.excluded['none'], 'None should be excluded when payments=true');
  assert(!result.excluded['playwright'], 'Playwright should be available');
});

test('filterPackageManagers shows Python package manager for Python stack', () => {
  const result = filterPackageManagers(packageManagers as any, 'python', 'react', 'fastapi');
  assert(!!result.excluded['pnpm'], 'pnpm should be excluded for Python stack');
  assert(!result.excluded['uv'], 'uv should be available for Python stack');
  assert(!result.excluded['poetry'], 'poetry should be available for Python stack');
});

test('filterBackendHostings excludes Cloudflare Workers for non-Hono backends', () => {
  const result = filterBackendHostings(backendHostingCatalog as any, 'express', 'typescript');
  assert(!!result.excluded['cloudflare-workers'], 'Cloudflare Workers should be excluded for Express');
});

test('filterPrimaryDatabases hides non-Supabase when Supabase auth selected', () => {
  const result = filterPrimaryDatabases(primaryDatabases as any, 'supabase-auth');
  assert(!!result.excluded['postgresql'], 'Postgres should be excluded (Supabase auth wants Supabase DB)');
  assert(!result.excluded['supabase-db'], 'Supabase DB should be allowed');
});

console.log('\n── Summary ──');
console.log(`  ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);