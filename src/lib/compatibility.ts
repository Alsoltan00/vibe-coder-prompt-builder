// =====================================================================
//   Compatibility Engine v2 — ZERO-TOLERANCE for contradictions
//   ---------------------------------------------------------------------
//   Every rule below returns severity='block'. The wizard hides all
//   conflicting options upstream via filter.ts, so the user literally
//   cannot reach an impossible combination. The validator runs after
//   generation to guarantee zero contradictions in the final output.
//
//   Coverage:
//   - Project type ↔ frontend/backend
//   - Frontend ↔ language
//   - Backend ↔ language
//   - Hosting ↔ frontend/backend/database
//   - Database (pgvector/TimescaleDB) ↔ primary
//   - Auth ↔ database
//   - Professional features ↔ required services
//   - Mobile/Desktop ↔ hosting/services
//   - CI/CD ↔ stack
// =====================================================================

import type {
  ProjectData,
  FrontendId,
  BackendId,
  DatabasePrimaryId,
  FrontendHostingId,
  BackendHostingId,
  DatabaseHostingId,
  AuthProviderId,
  PaymentId,
  StorageId,
  MonitoringId,
  AnalyticsId,
  PackageManagerId,
  LanguageId,
} from '@/types';

export type Severity = 'block';

export interface CompatibilityIssue {
  id: string;
  severity: Severity;
  field: string;
  message: string;
  fix?: string;
}

interface Rule {
  id: string;
  appliesTo: (data: ProjectData) => boolean;
  check: (data: ProjectData) => { field: string; fix?: string } | null;
  message: (data: ProjectData) => string;
}

// =====================================================================
//   Catalog of languages allowed per backend (each backend may support more than one language)
// =====================================================================
export const BACKEND_LANGUAGES: Record<BackendId, LanguageId[]> = {
  express: ['typescript', 'javascript'],
  fastify: ['typescript', 'javascript'],
  nestjs: ['typescript', 'javascript'],
  hono: ['typescript', 'javascript'],
  koa: ['typescript', 'javascript'],
  django: ['python'],
  fastapi: ['python'],
  flask: ['python'],
  'spring-boot': ['java', 'kotlin'],
  rails: ['ruby'],
  laravel: ['php'],
  symfony: ['php'],
  phoenix: ['elixir'],
  gin: ['go'],
  echo: ['go'],
  fiber: ['go'],
  actix: ['rust'],
  axum: ['rust'],
  aspnet: ['csharp'],
  none: [],
};

/** Primary language for a backend — used as the default when no language is set */
export const BACKEND_LANGUAGE: Record<BackendId, LanguageId> = {
  express: 'typescript',
  fastify: 'typescript',
  nestjs: 'typescript',
  hono: 'typescript',
  koa: 'typescript',
  django: 'python',
  fastapi: 'python',
  flask: 'python',
  'spring-boot': 'java',
  rails: 'ruby',
  laravel: 'php',
  symfony: 'php',
  phoenix: 'elixir',
  gin: 'go',
  echo: 'go',
  fiber: 'go',
  actix: 'rust',
  axum: 'rust',
  aspnet: 'csharp',
  none: 'typescript',
};

// Languages a frontend can use
export const FRONTEND_LANGUAGES: Record<FrontendId, string[]> = {
  nextjs: ['typescript', 'javascript'],
  remix: ['typescript', 'javascript'],
  nuxt: ['typescript', 'javascript'],
  sveltekit: ['typescript', 'javascript'],
  astro: ['typescript', 'javascript'],
  react: ['typescript', 'javascript'],
  vue: ['typescript', 'javascript'],
  preact: ['typescript', 'javascript'],
  solid: ['typescript', 'javascript'],
  svelte: ['typescript', 'javascript'],
  lit: ['typescript', 'javascript'],
  angular: ['typescript', 'javascript'],
  qwik: ['typescript', 'javascript'],
  ember: ['typescript', 'javascript'],
  'react-native': ['typescript', 'javascript'],
  expo: ['typescript', 'javascript'],
  flutter: ['dart'],
  swiftui: ['swift'],
  'jetpack-compose': ['kotlin'],
  tauri: ['typescript', 'javascript', 'rust'],
  electron: ['typescript', 'javascript'],
  none: [],
};

// Backends that need a node runtime
export const NODE_BACKENDS: BackendId[] = ['express', 'fastify', 'nestjs', 'hono', 'koa'];

// Edge-only backends (Cloudflare Workers)
export const EDGE_BACKENDS: BackendId[] = ['hono'];

// Full-stack frontends (backend should be none)
export const FULLSTACK_FRONTENDS: FrontendId[] = ['nextjs', 'remix', 'nuxt', 'sveltekit', 'astro'];

// Mobile frontends
export const MOBILE_FRONTENDS: FrontendId[] = ['react-native', 'expo', 'flutter', 'swiftui', 'jetpack-compose'];

// Desktop frontends
export const DESKTOP_FRONTENDS: FrontendId[] = ['tauri', 'electron'];

// Web frontends
export const WEB_FRONTENDS: FrontendId[] = [
  'react', 'nextjs', 'remix', 'vue', 'nuxt', 'angular', 'svelte', 'sveltekit',
  'solid', 'astro', 'qwik', 'ember', 'preact', 'lit',
];

// PostgreSQL-family databases
export const POSTGRES_DBS: DatabasePrimaryId[] = ['postgresql', 'supabase-db', 'neon', 'cockroachdb'];

// Payment providers (excluding none)
export const PAYMENT_PROVIDERS: PaymentId[] = ['stripe', 'paypal', 'paddle', 'lemonsqueezy', 'razorpay', 'square', 'adyen', 'mollie', 'checkoutcom'];

// Storage providers (excluding none)
export const STORAGE_PROVIDERS: StorageId[] = ['aws-s3', 'cloudflare-r2', 'backblaze-b2', 'google-cloud-storage', 'azure-blob', 'supabase-storage', 'uploadthing'];

// Analytics providers (excluding none)
export const ANALYTICS_PROVIDERS: AnalyticsId[] = ['google-analytics', 'mixpanel', 'amplitude', 'posthog', 'plausible', 'fathom', 'umami', 'datadog-rum', 'sentry-replay'];

// Monitoring providers (excluding none)
export const MONITORING_PROVIDERS: MonitoringId[] = ['sentry', 'datadog', 'new-relic', 'grafana-cloud', 'honeybadger', 'rollbar', 'axiom', 'logflare'];

// Package managers that work with Node-based stacks
export const NODE_PACKAGE_MANAGERS: PackageManagerId[] = ['npm', 'pnpm', 'yarn', 'bun'];

const RULES: Rule[] = [
  // ===================================================================
  // 1. PROJECT TYPE ↔ FRONTEND / BACKEND
  // ===================================================================
  {
    id: 'mobile-app-needs-mobile-frontend',
    appliesTo: (d) => d.identity.projectType === 'mobile-app',
    check: (d) => {
      const webOnly: FrontendId[] = ['nextjs', 'remix', 'nuxt', 'sveltekit', 'astro', 'react', 'vue', 'angular', 'svelte', 'solid', 'qwik', 'ember', 'preact', 'lit', 'tauri', 'electron'];
      return webOnly.includes(d.stack.frontend as FrontendId)
        ? { field: 'stack.frontend', fix: 'react-native' }
        : null;
    },
    message: () => 'Mobile app requires a mobile frontend (React Native, Expo, Flutter, SwiftUI, Jetpack Compose).',
  },
  {
    id: 'desktop-app-needs-desktop-frontend',
    appliesTo: (d) => d.identity.projectType === 'desktop-app',
    check: (d) => DESKTOP_FRONTENDS.includes(d.stack.frontend as FrontendId)
      ? null
      : { field: 'stack.frontend', fix: 'tauri' },
    message: () => 'Desktop app requires Tauri or Electron.',
  },
  {
    id: 'cli-tool-no-frontend',
    appliesTo: (d) => d.identity.projectType === 'cli-tool',
    check: (d) => d.stack.frontend === 'none'
      ? null
      : { field: 'stack.frontend', fix: 'none' },
    message: () => 'CLI tool has no UI — frontend must be `none`.',
  },
  {
    id: 'cli-tool-no-backend',
    appliesTo: (d) => d.identity.projectType === 'cli-tool',
    check: (d) => d.stack.backend === 'none'
      ? null
      : { field: 'stack.backend', fix: 'none' },
    message: () => 'CLI tool has no separate backend — set backend to `none` (or pick a language-specific framework).',
  },
  {
    id: 'library-sdk-no-frontend',
    appliesTo: (d) => d.identity.projectType === 'library-sdk',
    check: (d) => d.stack.frontend === 'none'
      ? null
      : { field: 'stack.frontend', fix: 'none' },
    message: () => 'Library/SDK has no UI — frontend must be `none`.',
  },
  {
    id: 'library-sdk-no-backend',
    appliesTo: (d) => d.identity.projectType === 'library-sdk',
    check: (d) => d.stack.backend === 'none'
      ? null
      : { field: 'stack.backend', fix: 'none' },
    message: () => 'Library/SDK has no separate backend — set backend to `none`.',
  },
  {
    id: 'api-backend-no-frontend',
    appliesTo: (d) => d.identity.projectType === 'api-backend',
    check: (d) => d.stack.frontend === 'none'
      ? null
      : { field: 'stack.frontend', fix: 'none' },
    message: () => 'API backend has no UI — frontend must be `none`.',
  },
  {
    id: 'landing-page-no-backend',
    appliesTo: (d) => d.identity.projectType === 'landing-page',
    check: (d) => d.stack.backend === 'none'
      ? null
      : { field: 'stack.backend', fix: 'none' },
    message: () => 'Landing page does not need a separate backend.',
  },

  // ===================================================================
  // 2. FRONTEND ↔ LANGUAGE
  // ===================================================================
  {
    id: 'swiftui-needs-swift',
    appliesTo: (d) => d.stack.frontend === 'swiftui',
    check: (d) =>
      d.language === '' || d.language === 'swift'
        ? null
        : { field: 'language', fix: 'swift' },
    message: () => 'SwiftUI requires Swift.',
  },
  {
    id: 'compose-needs-kotlin',
    appliesTo: (d) => d.stack.frontend === 'jetpack-compose',
    check: (d) =>
      d.language === '' || d.language === 'kotlin'
        ? null
        : { field: 'language', fix: 'kotlin' },
    message: () => 'Jetpack Compose requires Kotlin.',
  },
  {
    id: 'flutter-needs-dart',
    appliesTo: (d) => d.stack.frontend === 'flutter',
    check: (d) =>
      d.language === '' || d.language === 'dart'
        ? null
        : { field: 'language', fix: 'dart' },
    message: () => 'Flutter requires Dart.',
  },
  {
    id: 'web-frontend-needs-js-ts',
    appliesTo: (d) => WEB_FRONTENDS.includes(d.stack.frontend as FrontendId) && d.stack.frontend !== 'astro',
    check: (d) => {
      const allowed = FRONTEND_LANGUAGES[d.stack.frontend as FrontendId] || [];
      return d.language !== '' && !allowed.includes(d.language)
        ? { field: 'language', fix: 'typescript' }
        : null;
    },
    message: () => 'Web frontend requires TypeScript or JavaScript.',
  },

  // ===================================================================
  // 3. BACKEND ↔ LANGUAGE
  // ===================================================================
  {
    id: 'backend-implies-language',
    appliesTo: (d) => d.stack.backend !== '' && (d.stack.backend as string) !== 'none',
    check: (d) => {
      const required = BACKEND_LANGUAGE[d.stack.backend as BackendId];
      if (!required) return null;
      return d.language !== '' && d.language !== required
        ? { field: 'language', fix: required }
        : null;
    },
    message: (d) => {
      const required = BACKEND_LANGUAGE[d.stack.backend as BackendId];
      const label = (d.stack.backend as string).charAt(0).toUpperCase() + (d.stack.backend as string).slice(1);
      return `${label} requires ${required}.`;
    },
  },

  // ===================================================================
  // 4. FULL-STACK FRONTENDS → NO BACKEND
  // ===================================================================
  {
    id: 'fullstack-frontend-no-backend',
    appliesTo: (d) => FULLSTACK_FRONTENDS.includes(d.stack.frontend as FrontendId),
    check: (d) => d.stack.backend !== 'none'
      ? { field: 'stack.backend', fix: 'none' }
      : null,
    message: (d) => `${d.stack.frontend} is a full-stack framework — backend must be \`none\`.`,
  },

  // ===================================================================
  // 5. MOBILE / DESKTOP FRONTENDS → NO FRONTEND HOSTING
  // ===================================================================
  {
    id: 'mobile-no-frontend-hosting',
    appliesTo: (d) => MOBILE_FRONTENDS.includes(d.stack.frontend as FrontendId),
    check: (d) => d.stack.hosting.frontend !== 'none'
      ? { field: 'stack.hosting.frontend', fix: 'none' }
      : null,
    message: () => 'Mobile apps don\'t need frontend hosting — use App Store / Play Store.',
  },
  {
    id: 'desktop-no-frontend-hosting',
    appliesTo: (d) => DESKTOP_FRONTENDS.includes(d.stack.frontend as FrontendId),
    check: (d) => d.stack.hosting.frontend !== 'none'
      ? { field: 'stack.hosting.frontend', fix: 'none' }
      : null,
    message: () => 'Desktop apps don\'t need frontend hosting — bundle in the installer.',
  },

  // ===================================================================
  // 6. WEB FRONTEND → MUST HAVE FRONTEND HOSTING
  // ===================================================================
  {
    id: 'web-frontend-needs-hosting',
    appliesTo: (d) => WEB_FRONTENDS.includes(d.stack.frontend as FrontendId),
    check: (d) => d.stack.hosting.frontend === 'none'
      ? { field: 'stack.hosting.frontend', fix: 'vercel' }
      : null,
    message: () => 'Web frontend must be hosted (Vercel, Netlify, etc.).',
  },

  // ===================================================================
  // 7. BACKEND EXISTS → MUST HAVE BACKEND HOSTING
  // ===================================================================
  {
    id: 'backend-needs-hosting',
    appliesTo: (d) => d.stack.backend !== '' && d.stack.backend !== 'none',
    check: (d) => d.stack.hosting.backend === 'none'
      ? { field: 'stack.hosting.backend', fix: 'railway' }
      : null,
    message: () => 'Backend must be hosted.',
  },

  // ===================================================================
  // 8. NO BACKEND → NO BACKEND HOSTING
  // ===================================================================
  {
    id: 'no-backend-no-hosting',
    appliesTo: (d) => (d.stack.backend as string) === 'none' || d.stack.backend === '',
    check: (d) => d.stack.hosting.backend !== 'none'
      ? { field: 'stack.hosting.backend', fix: 'none' }
      : null,
    message: () => 'No backend → no backend hosting.',
  },

  // ===================================================================
  // 9. DATABASE → MUST HAVE DB HOSTING (unless SQLite/in-memory)
  // ===================================================================
  {
    id: 'db-needs-hosting',
    appliesTo: (d) =>
      d.stack.database.primary !== 'none' &&
      d.stack.database.primary !== 'sqlite',
    check: (d) => d.stack.hosting.database === 'none'
      ? { field: 'stack.hosting.database', fix: 'neon' }
      : null,
    message: () => 'Database must be hosted.',
  },
  {
    id: 'sqlite-no-hosting',
    appliesTo: (d) => d.stack.database.primary === 'sqlite',
    check: (d) => d.stack.hosting.database !== 'none'
      ? { field: 'stack.hosting.database', fix: 'none' }
      : null,
    message: () => 'SQLite is local — no database hosting needed.',
  },

  // ===================================================================
  // 10. PGVECTOR / TIMESCALEDB → POSTGRES
  // ===================================================================
  {
    id: 'pgvector-needs-postgres',
    appliesTo: (d) => d.stack.database.vector === 'pgvector',
    check: (d) =>
      POSTGRES_DBS.includes(d.stack.database.primary)
        ? null
        : { field: 'stack.database.primary', fix: 'postgresql' },
    message: () => 'pgvector requires PostgreSQL.',
  },
  {
    id: 'timescaledb-needs-postgres',
    appliesTo: (d) => d.stack.database.timeseries === 'timescaledb',
    check: (d) =>
      POSTGRES_DBS.includes(d.stack.database.primary)
        ? null
        : { field: 'stack.database.primary', fix: 'postgresql' },
    message: () => 'TimescaleDB requires PostgreSQL.',
  },

  // ===================================================================
  // 11. AUTH ↔ DATABASE
  // ===================================================================
  {
    id: 'supabase-auth-needs-supabase-db',
    appliesTo: (d) => d.stack.auth.primary === 'supabase-auth',
    check: (d) =>
      d.stack.database.primary === 'supabase-db'
        ? null
        : { field: 'stack.database.primary', fix: 'supabase-db' },
    message: () => 'Supabase Auth requires Supabase Postgres (RLS, etc.).',
  },
  {
    id: 'firebase-auth-needs-firestore',
    appliesTo: (d) => d.stack.auth.primary === 'firebase-auth',
    check: (d) =>
      d.stack.database.primary === 'firestore'
        ? null
        : { field: 'stack.database.primary', fix: 'firestore' },
    message: () => 'Firebase Auth requires Firestore.',
  },

  // ===================================================================
  // 12. PROFESSIONAL FEATURES ↔ SERVICES
  // ===================================================================
  {
    id: 'payments-needs-provider',
    appliesTo: (d) => d.professionalRequirements.payments,
    check: (d) =>
      PAYMENT_PROVIDERS.includes(d.stack.thirdParty.payments as PaymentId)
        ? null
        : { field: 'stack.thirdParty.payments', fix: 'stripe' },
    message: () => 'Payments feature requires a payment provider (Stripe, PayPal, etc.).',
  },
  {
    id: 'file-uploads-needs-storage',
    appliesTo: (d) => d.professionalRequirements.fileUploads,
    check: (d) =>
      STORAGE_PROVIDERS.includes(d.stack.thirdParty.storage as StorageId)
        ? null
        : { field: 'stack.thirdParty.storage', fix: 'aws-s3' },
    message: () => 'File uploads requires a storage provider (S3, R2, Supabase Storage, etc.).',
  },
  {
    id: 'analytics-needs-provider',
    appliesTo: (d) => d.professionalRequirements.analytics,
    check: (d) =>
      ANALYTICS_PROVIDERS.includes(d.stack.thirdParty.analytics as AnalyticsId)
        ? null
        : { field: 'stack.thirdParty.analytics', fix: 'posthog' },
    message: () => 'Analytics feature requires an analytics provider.',
  },
  {
    id: 'admin-needs-auth',
    appliesTo: (d) => d.professionalRequirements.adminPanel,
    check: (d) =>
      d.stack.auth.primary !== '' && d.stack.auth.primary !== 'none'
        ? null
        : { field: 'stack.auth.primary', fix: 'clerk' },
    message: () => 'Admin panel requires authentication.',
  },
  {
    id: 'user-accounts-needs-auth',
    appliesTo: (d) => d.professionalRequirements.userAccounts,
    check: (d) =>
      d.stack.auth.primary !== '' && d.stack.auth.primary !== 'none'
        ? null
        : { field: 'stack.auth.primary', fix: 'clerk' },
    message: () => 'User accounts require authentication.',
  },

  // ===================================================================
  // 13. CI/CD ↔ STACK
  // ===================================================================
  {
    id: 'node-stack-needs-node-package-manager',
    appliesTo: (d) =>
      NODE_BACKENDS.includes(d.stack.backend as BackendId) ||
      FRONTEND_LANGUAGES[d.stack.frontend as FrontendId]?.some((l) => l === 'typescript' || l === 'javascript') ||
      false,
    check: (d) =>
      NODE_PACKAGE_MANAGERS.includes(d.stack.devops.packageManager as PackageManagerId)
        ? null
        : { field: 'stack.devops.packageManager', fix: 'pnpm' },
    message: () => 'JavaScript/TypeScript stack requires a Node package manager (npm/pnpm/yarn/bun).',
  },

  // ===================================================================
  // 14. EDGE RUNTIMES (Cloudflare Workers → only Hono)
  // ===================================================================
  {
    id: 'cloudflare-workers-hono-only',
    appliesTo: (d) => d.stack.hosting.backend === 'cloudflare-workers',
    check: (d) =>
      (d.stack.backend as string) === 'hono' || (d.stack.backend as string) === 'none' || d.stack.backend === ''
        ? null
        : { field: 'stack.backend', fix: 'hono' },
    message: () => 'Cloudflare Workers only supports Hono (or static).',
  },

  // ===================================================================
  // 15. TESTING — payments require E2E
  // ===================================================================
  {
    id: 'payments-needs-e2e',
    appliesTo: (d) => d.professionalRequirements.payments,
    check: (d) =>
      (d.stack.testing.e2e as string) !== '' && (d.stack.testing.e2e as string) !== 'none'
        ? null
        : { field: 'stack.testing.e2e', fix: 'playwright' },
    message: () => 'Payments require E2E testing.',
  },

  // ===================================================================
  // 16. IDENTITY — name required
  // ===================================================================
  {
    id: 'project-name-required',
    appliesTo: (d) => true,
    check: (d) =>
      d.identity.name.trim() !== ''
        ? null
        : { field: 'identity.name', fix: '' },
    message: () => 'Project name is required.',
  },
];

// =====================================================================
//   Public API
// =====================================================================
export function evaluateCompatibility(data: ProjectData): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  for (const rule of RULES) {
    if (!rule.appliesTo(data)) continue;
    const found = rule.check(data);
    if (found) {
      issues.push({
        id: rule.id,
        severity: 'block',
        field: found.field,
        message: rule.message(data),
        fix: found.fix,
      });
    }
  }
  return issues;
}

export function hasBlocker(issues: CompatibilityIssue[]): boolean {
  return issues.length > 0;
}

/**
 * Auto-fix the data by applying suggested `fix` values for all block-level
 * issues. Iterates until no more issues (max 5 passes for safety).
 */
export function autoFix(data: ProjectData): ProjectData {
  let result = structuredClone(data);
  for (let pass = 0; pass < 5; pass++) {
    const issues = evaluateCompatibility(result);
    const fixable = issues.filter((i) => i.fix);
    if (fixable.length === 0) break;
    for (const issue of fixable) {
      applyFix(result, issue.field, issue.fix!);
    }
  }
  return result;
}

function applyFix(data: ProjectData, field: string, value: string) {
  const parts = field.split('.');
  let target: any = data;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (key === undefined) return;
    target = target[key];
    if (target == null) return;
  }
  const last = parts[parts.length - 1];
  if (last === undefined) return;
  target[last] = value;
}

export const _internals = {
  BACKEND_LANGUAGE,
  FRONTEND_LANGUAGES,
  NODE_BACKENDS,
  FULLSTACK_FRONTENDS,
  MOBILE_FRONTENDS,
  DESKTOP_FRONTENDS,
  WEB_FRONTENDS,
  POSTGRES_DBS,
  PAYMENT_PROVIDERS,
  STORAGE_PROVIDERS,
  ANALYTICS_PROVIDERS,
  MONITORING_PROVIDERS,
  NODE_PACKAGE_MANAGERS,
};
