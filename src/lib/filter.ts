// =====================================================================
//   WizardFilter — Cascading Dependency Resolution
//   ---------------------------------------------------------------------
//   Each catalog is filtered by current selections. Incompatible options
//   are HIDDEN with a tooltip explaining why. The user literally cannot
//   pick a conflicting option at the source.
//
//   Every filter here is derived from compatibility.ts RULES — the
//   single source of truth for what is allowed.
// =====================================================================

import type {
  ProjectData, ProjectTypeId, FrontendId, BackendId,
  DatabasePrimaryId, FrontendHostingId, BackendHostingId,
  DatabaseHostingId, AuthProviderId, UnitTestId, E2eTestId, ComponentTestId, PackageManagerId,
  PaymentId, StorageId, AnalyticsId, MonitoringId, LanguageId,
  VectorId, TimeSeriesId, SearchId, CiId, CdId, IacId, MonorepoId,
  CssFrameworkId, ComponentLibraryId, IconSetId, FontFamilyId,
} from '../types';
import type { CatalogEntry } from './catalog/types';
import {
  WEB_FRONTENDS, MOBILE_FRONTENDS, DESKTOP_FRONTENDS,
  FULLSTACK_FRONTENDS, NODE_BACKENDS, EDGE_BACKENDS,
  POSTGRES_DBS, PAYMENT_PROVIDERS, STORAGE_PROVIDERS,
  ANALYTICS_PROVIDERS, MONITORING_PROVIDERS,
  NODE_PACKAGE_MANAGERS,
  FRONTEND_LANGUAGES, BACKEND_LANGUAGE, BACKEND_LANGUAGES,
} from './compatibility';

export interface FilterResult<TId extends string> {
  catalog: CatalogEntry<TId>[];
  pinnedDefault: TId | '';
  excluded: Record<string, string>;
}

const exclude = (map: Record<string, string>, id: string, reason: string) => {
  map[id] = reason;
};

// =====================================================================
//   Per-category filters
// =====================================================================

/** FRONTEND — based on project type + language */
export function filterFrontends(
  all: CatalogEntry<FrontendId>[],
  projectType: ProjectTypeId | '',
  language: LanguageId | '',
): FilterResult<FrontendId> {
  const excluded: Record<string, string> = {};

  if (projectType === 'mobile-app') {
    for (const f of all) {
      if (!MOBILE_FRONTENDS.includes(f.id)) {
        exclude(excluded, f.id, 'Mobile app requires a mobile frontend');
      }
    }
  } else if (projectType === 'desktop-app') {
    for (const f of all) {
      if (!DESKTOP_FRONTENDS.includes(f.id)) {
        exclude(excluded, f.id, 'Desktop app requires Tauri or Electron');
      }
    }
  } else if (['cli-tool', 'library-sdk', 'api-backend'].includes(projectType)) {
    for (const f of all) {
      if (f.id !== 'none') {
        exclude(excluded, f.id, `${projectType} has no UI`);
      }
    }
  }

  // Filter by language: if language already chosen, hide frontends that don't support it
  if (language) {
    for (const f of all) {
      if (f.id === 'none') continue;
      const supported = FRONTEND_LANGUAGES[f.id];
      if (supported && supported.length > 0 && !supported.includes(language)) {
        exclude(excluded, f.id, `${f.name} doesn't support ${language}`);
      }
    }
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  let def: FrontendId | '' = '';
  if (projectType === 'mobile-app') def = 'react-native';
  else if (projectType === 'desktop-app') def = 'tauri';
  else if (['cli-tool', 'library-sdk', 'api-backend'].includes(projectType)) def = 'none';
  else if (!excluded['nextjs']) def = 'nextjs';
  else if (!excluded['react']) def = 'react';
  else def = filtered[0]?.id ?? '';

  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** BACKEND — based on language + frontend (full-stack → none) */
export function filterBackends(
  all: CatalogEntry<BackendId>[],
  frontend: FrontendId | '',
  projectType: ProjectTypeId | '',
  language: LanguageId | '',
): FilterResult<BackendId> {
  const excluded: Record<string, string> = {};

  // Full-stack frontends → backend must be none
  if (FULLSTACK_FRONTENDS.includes(frontend as FrontendId)) {
    for (const b of all) {
      if (b.id !== 'none') {
        exclude(excluded, b.id, `${frontend} is full-stack — no separate backend`);
      }
    }
  }

  // CLI / library / API-only
  if (['cli-tool', 'library-sdk', 'api-backend'].includes(projectType)) {
    for (const b of all) {
      if (b.id !== 'none') {
        exclude(excluded, b.id, `${projectType} has no separate backend`);
      }
    }
  }

  // Filter by language
  if (language) {
    for (const b of all) {
      if (b.id === 'none') continue;
      const required = BACKEND_LANGUAGE[b.id];
      if (required && required !== language) {
        exclude(excluded, b.id, `${b.name} requires ${required}`);
      }
    }
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  let def: BackendId | '' = '';
  if (FULLSTACK_FRONTENDS.includes(frontend as FrontendId)) def = 'none';
  else if (['cli-tool', 'library-sdk', 'api-backend'].includes(projectType)) def = 'none';
  else if (language === 'python') def = 'fastapi';
  else if (language === 'typescript' || language === 'javascript') def = 'express';
  else if (language === 'go') def = 'gin';
  else if (language === 'rust') def = 'actix';
  else def = filtered.find((b) => b.id !== 'none')?.id ?? '';

  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** LANGUAGE — based on frontend + backend (either constrains) */
export function filterLanguages(
  all: CatalogEntry<any>[],
  frontend: FrontendId | '',
  backend: BackendId | '',
): FilterResult<any> {
  const excluded: Record<string, string> = {};

  // Frontend-required language
  if (frontend && FRONTEND_LANGUAGES[frontend as FrontendId]) {
    const supported = FRONTEND_LANGUAGES[frontend as FrontendId];
    for (const l of all) {
      if (supported.length > 0 && !supported.includes(l.id)) {
        exclude(excluded, l.id, `${frontend} requires ${supported.join(' or ')}`);
      }
    }
  }

  // Backend-supported languages
  if (backend && backend !== 'none' && BACKEND_LANGUAGES[backend as BackendId]) {
    const supported = BACKEND_LANGUAGES[backend as BackendId];
    for (const l of all) {
      if (supported.length > 0 && !supported.includes(l.id as any)) {
        exclude(excluded, l.id, `${backend} requires ${supported.join(' or ')}`);
      }
    }
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  let def: string = '';
  if (backend && backend !== 'none' && (BACKEND_LANGUAGES[backend as BackendId]?.length ?? 0) > 0) {
    def = BACKEND_LANGUAGE[backend as BackendId];
  } else if (frontend && (FRONTEND_LANGUAGES[frontend as FrontendId]?.length ?? 0) > 0) {
    def = FRONTEND_LANGUAGES[frontend as FrontendId]![0]!;
  } else {
    def = 'typescript';
  }

  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** DATABASE — primary */
export function filterPrimaryDatabases(
  all: CatalogEntry<DatabasePrimaryId>[],
  auth: AuthProviderId | '',
): FilterResult<DatabasePrimaryId> {
  const excluded: Record<string, string> = {};

  // Supabase auth → only Supabase DB
  if (auth === 'supabase-auth') {
    for (const d of all) {
      if (d.id !== 'supabase-db' && d.id !== 'none') {
        exclude(excluded, d.id, 'Supabase Auth requires Supabase Postgres');
      }
    }
  }

  // Firebase auth → only Firestore
  if (auth === 'firebase-auth') {
    for (const d of all) {
      if (d.id !== 'firestore' && d.id !== 'none') {
        exclude(excluded, d.id, 'Firebase Auth requires Firestore');
      }
    }
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: auth === 'supabase-auth' ? 'supabase-db' : auth === 'firebase-auth' ? 'firestore' : 'postgresql',
    excluded,
  };
}

/** VECTOR DB — only valid options per primary */
export function filterVectorDatabases(
  all: CatalogEntry<VectorId>[],
  primaryDb: DatabasePrimaryId | '',
): FilterResult<VectorId> {
  const excluded: Record<string, string> = {};
  if (!POSTGRES_DBS.includes(primaryDb as DatabasePrimaryId)) {
    for (const v of all) {
      if (v.id === 'pgvector') {
        exclude(excluded, v.id, 'pgvector requires PostgreSQL');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return { catalog: filtered, pinnedDefault: 'none', excluded };
}

/** TIME-SERIES DB */
export function filterTimeSeriesDatabases(
  all: CatalogEntry<TimeSeriesId>[],
  primaryDb: DatabasePrimaryId | '',
): FilterResult<TimeSeriesId> {
  const excluded: Record<string, string> = {};
  if (!POSTGRES_DBS.includes(primaryDb as DatabasePrimaryId)) {
    for (const v of all) {
      if (v.id === 'timescaledb') {
        exclude(excluded, v.id, 'TimescaleDB requires PostgreSQL');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return { catalog: filtered, pinnedDefault: 'none', excluded };
}

/** SEARCH DB */
export function filterSearchDatabases(
  all: CatalogEntry<SearchId>[],
  managedSearch: string | '',
): FilterResult<SearchId> {
  const excluded: Record<string, string> = {};
  if (managedSearch && managedSearch !== 'none') {
    for (const s of all) {
      if (s.id !== 'none') {
        exclude(excluded, s.id, 'Managed search already selected — pick one search solution');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return { catalog: filtered, pinnedDefault: 'none', excluded };
}

/** FRONTEND HOSTING */
export function filterFrontendHostings(
  all: CatalogEntry<FrontendHostingId>[],
  frontend: FrontendId | '',
): FilterResult<FrontendHostingId> {
  const excluded: Record<string, string> = {};
  if (MOBILE_FRONTENDS.includes(frontend as FrontendId) || DESKTOP_FRONTENDS.includes(frontend as FrontendId)) {
    for (const h of all) {
      exclude(excluded, h.id, 'Mobile/desktop apps don\'t need frontend hosting');
    }
  }
  if (frontend === '' || frontend === 'none') {
    for (const h of all) {
      if (h.id !== 'none') {
        exclude(excluded, h.id, 'No frontend to host');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  let def: FrontendHostingId = 'none';
  if (!excluded['vercel']) def = 'vercel';
  else if (!excluded['netlify']) def = 'netlify';
  else if (!excluded['cloudflare-pages']) def = 'cloudflare-pages';
  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** BACKEND HOSTING */
export function filterBackendHostings(
  all: CatalogEntry<BackendHostingId>[],
  backend: BackendId | '',
  language: LanguageId | '',
): FilterResult<BackendHostingId> {
  const excluded: Record<string, string> = {};
  if (backend === '' || backend === 'none') {
    for (const h of all) {
      if (h.id !== 'none') {
        exclude(excluded, h.id, 'No backend to host');
      }
    }
  } else {
    // Cloudflare Workers → only Hono
    if (backend !== 'hono') {
      for (const h of all) {
        if (h.id === 'cloudflare-workers') {
          exclude(excluded, h.id, 'Only Hono works on Cloudflare Workers');
        }
      }
    }
    // Vercel/Netlify functions only work with Node.js backends
    const nonNodeBackends: BackendId[] = ['django', 'fastapi', 'flask', 'gin', 'echo', 'fiber', 'actix', 'axum', 'spring-boot', 'rails', 'laravel', 'symfony', 'phoenix', 'aspnet'];
    if (nonNodeBackends.includes(backend as BackendId)) {
      for (const h of all) {
        if (h.id === 'vercel-functions' || h.id === 'netlify-functions') {
          exclude(excluded, h.id, `${backend} is not a Node.js framework — use a container or VM host`);
        }
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  let def: BackendHostingId = 'none';
  if (backend === 'hono') def = 'cloudflare-workers';
  else if (backend !== 'none' && backend !== '') {
    def = 'railway';
  }
  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** DATABASE HOSTING */
export function filterDatabaseHostings(
  all: CatalogEntry<DatabaseHostingId>[],
  primaryDb: DatabasePrimaryId | '',
): FilterResult<DatabaseHostingId> {
  const excluded: Record<string, string> = {};
  if (primaryDb === 'sqlite' || primaryDb === 'none' || primaryDb === '') {
    for (const h of all) {
      if (h.id !== 'none') {
        exclude(excluded, h.id, 'SQLite is local — no DB hosting needed');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  let def: DatabaseHostingId = 'none';
  if (primaryDb === 'postgresql' && !excluded['neon']) def = 'neon';
  else if (primaryDb === 'supabase-db') def = 'supabase';
  else if (primaryDb === 'mongodb') def = 'mongodb-atlas';
  else if (primaryDb === 'mysql' || primaryDb === 'mariadb') def = 'planetscale';
  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** AUTH */
export function filterAuthProviders(
  all: CatalogEntry<AuthProviderId>[],
  frontend: FrontendId | '',
  primaryDb: DatabasePrimaryId | '',
  userAccountsRequired: boolean,
  adminPanelRequired: boolean,
): FilterResult<AuthProviderId> {
  const excluded: Record<string, string> = {};
  
  if (userAccountsRequired || adminPanelRequired) {
    for (const a of all) {
      if (a.id === 'none') {
        exclude(excluded, a.id, 'User accounts and Admin panel require authentication');
      }
    }
  }

  // Supabase auth only with supabase-db
  if (primaryDb !== 'supabase-db' && primaryDb !== 'none') {
    for (const a of all) {
      if (a.id === 'supabase-auth') {
        exclude(excluded, a.id, 'Supabase Auth requires Supabase Postgres');
      }
    }
  }
  // Firebase auth only with firestore
  if (primaryDb !== 'firestore' && primaryDb !== 'none') {
    for (const a of all) {
      if (a.id === 'firebase-auth') {
        exclude(excluded, a.id, 'Firebase Auth requires Firestore');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  let def: AuthProviderId = 'none';
  if (userAccountsRequired || adminPanelRequired) def = 'clerk';
  if (primaryDb === 'supabase-db') def = 'supabase-auth';
  else if (frontend === 'nextjs') def = 'nextauth';
  else if (!excluded['clerk']) def = 'clerk';
  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** PAYMENT — disabled if payments feature off */
export function filterPaymentProviders(
  all: CatalogEntry<PaymentId>[],
  paymentsRequired: boolean,
): FilterResult<PaymentId> {
  const excluded: Record<string, string> = {};
  if (!paymentsRequired) {
    for (const p of all) {
      if (p.id !== 'none') {
        exclude(excluded, p.id, 'Enable Payments feature first');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return { catalog: filtered, pinnedDefault: 'stripe', excluded };
}

/** STORAGE */
export function filterStorageProviders(
  all: CatalogEntry<StorageId>[],
  uploadsRequired: boolean,
  primaryDb: DatabasePrimaryId | '',
): FilterResult<StorageId> {
  const excluded: Record<string, string> = {};
  if (!uploadsRequired) {
    for (const s of all) {
      if (s.id !== 'none') {
        exclude(excluded, s.id, 'Enable File uploads feature first');
      }
    }
  }
  // Supabase DB → prefer supabase-storage
  if (primaryDb !== 'supabase-db') {
    for (const s of all) {
      if (s.id === 'supabase-storage') {
        exclude(excluded, s.id, 'Supabase Storage requires Supabase Postgres');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  let def: StorageId = 'none';
  if (uploadsRequired) {
    if (primaryDb === 'supabase-db') def = 'supabase-storage';
    else def = 'aws-s3';
  }
  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** ANALYTICS */
export function filterAnalyticsProviders(
  all: CatalogEntry<AnalyticsId>[],
  analyticsRequired: boolean,
): FilterResult<AnalyticsId> {
  const excluded: Record<string, string> = {};
  if (!analyticsRequired) {
    for (const a of all) {
      if (a.id !== 'none') {
        exclude(excluded, a.id, 'Enable Analytics feature first');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return { catalog: filtered, pinnedDefault: analyticsRequired ? 'posthog' : 'none', excluded };
}

/** MONITORING — always allowed (sentry recommended for prod) */
export function filterMonitoringProviders(
  all: CatalogEntry<MonitoringId>[],
): FilterResult<MonitoringId> {
  const excluded: Record<string, string> = {};
  const filtered = all.filter((e) => !excluded[e.id]);
  return { catalog: filtered, pinnedDefault: 'sentry', excluded };
}

/** MANAGED SEARCH (Algolia/Meilisearch cloud) */
export function filterManagedSearch(
  all: CatalogEntry<string>[],
  dbSearch: string | '',
): FilterResult<string> {
  const excluded: Record<string, string> = {};
  if (dbSearch && dbSearch !== 'none') {
    for (const s of all) {
      if (s.id !== 'none') {
        exclude(excluded, s.id, 'Database search already selected — pick one search solution');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return { catalog: filtered, pinnedDefault: 'none', excluded };
}

/** E2E TEST — payments/realTime need E2E */
export function filterE2eTests(
  all: CatalogEntry<E2eTestId>[],
  paymentsRequired: boolean,
  userAccounts: boolean,
): FilterResult<E2eTestId> {
  const excluded: Record<string, string> = {};
  if (paymentsRequired || userAccounts) {
    for (const t of all) {
      if (t.id === 'none') {
        exclude(excluded, t.id, 'Payments/user accounts require E2E testing');
      }
    }
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: paymentsRequired || userAccounts ? 'playwright' : 'none',
    excluded,
  };
}

/** PACKAGE MANAGER — must match the chosen language (not just stack — language is the source of truth) */
export function filterPackageManagers(
  all: CatalogEntry<PackageManagerId>[],
  language: LanguageId | '',
  frontend: FrontendId | '',
  backend: BackendId | '',
): FilterResult<PackageManagerId> {
  const excluded: Record<string, string> = {};
  const isNodeLanguage = language === 'typescript' || language === 'javascript';

  if (language && !isNodeLanguage) {
    // Non-Node language → hide node package managers
    for (const pm of all) {
      if (NODE_PACKAGE_MANAGERS.includes(pm.id)) {
        exclude(excluded, pm.id, `${language} stack needs a language-specific package manager`);
      }
    }
  } else if (isNodeLanguage) {
    // Node language → keep only node package managers
  } else {
    // No language yet → derive from backend/frontend
    const backendIsNode = backend && NODE_BACKENDS.includes(backend as BackendId);
    const frontendIsNode =
      frontend &&
      (FRONTEND_LANGUAGES[frontend as FrontendId] as string[] | undefined)?.some(
        (l: string) => l === 'typescript' || l === 'javascript',
      ) === true;
    const inferredNode = !!(backendIsNode || frontendIsNode);

    if (!inferredNode) {
      for (const pm of all) {
        if (NODE_PACKAGE_MANAGERS.includes(pm.id)) {
          exclude(excluded, pm.id, 'Non-JS stack needs a language-specific package manager');
        }
      }
    }
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  let def: PackageManagerId = 'pnpm';
  if (language === 'python') def = 'uv';
  else if (language === 'go') def = 'go-modules';
  else if (language === 'rust') def = 'cargo';
  else if (language === 'java') def = 'maven';
  else if (language === 'ruby') def = 'bundler';
  else if (language === 'php') def = 'composer';
  return { catalog: filtered, pinnedDefault: def, excluded };
}

/** COMPONENT TEST — requires frontend */
export function filterComponentTests(
  all: CatalogEntry<ComponentTestId>[],
  frontend: FrontendId | '',
): FilterResult<ComponentTestId> {
  const excluded: Record<string, string> = {};
  if (frontend === 'none' || frontend === '') {
    for (const c of all) {
      if (c.id !== 'none') {
        exclude(excluded, c.id, 'Component testing requires a frontend');
      }
    }
  }
  return { catalog: all.filter((e) => !excluded[e.id]), pinnedDefault: 'none', excluded };
}

/** UNIT TEST — language specific */
export function filterUnitTests(
  all: CatalogEntry<UnitTestId>[],
  language: LanguageId | '',
): FilterResult<UnitTestId> {
  const excluded: Record<string, string> = {};
  let def: UnitTestId = 'vitest';
  
  if (language && language !== 'typescript' && language !== 'javascript') {
    for (const u of all) {
      if (['vitest', 'jest', 'mocha'].includes(u.id)) {
        exclude(excluded, u.id, 'Node.js testing frameworks are for JS/TS only');
      }
    }
    if (language === 'python') def = 'pytest';
    else if (language === 'go') def = 'go-test';
    else if (language === 'rust') def = 'cargo-test';
    else if (language === 'ruby') def = 'rspec';
    else if (language === 'php') def = 'phpunit';
    else if (language === 'java') def = 'junit';
    else def = 'none';
  }
  
  // Specific exclusions for other languages
  for (const u of all) {
    if (u.id === 'pytest' && language !== 'python' && language !== '') exclude(excluded, u.id, 'pytest is for Python');
    if (u.id === 'go-test' && language !== 'go' && language !== '') exclude(excluded, u.id, 'go-test is for Go');
    if (u.id === 'cargo-test' && language !== 'rust' && language !== '') exclude(excluded, u.id, 'cargo-test is for Rust');
    if (u.id === 'rspec' && language !== 'ruby' && language !== '') exclude(excluded, u.id, 'rspec is for Ruby');
    if (u.id === 'phpunit' && language !== 'php' && language !== '') exclude(excluded, u.id, 'phpunit is for PHP');
    if (u.id === 'junit' && language !== 'java' && language !== '') exclude(excluded, u.id, 'junit is for Java');
  }

  return { catalog: all.filter((e) => !excluded[e.id]), pinnedDefault: def, excluded };
}

/** MONOREPO — JS tools for JS */
export function filterMonorepos(
  all: CatalogEntry<MonorepoId>[],
  language: LanguageId | '',
  frontend: FrontendId | '',
  backend: BackendId | '',
): FilterResult<MonorepoId> {
  const excluded: Record<string, string> = {};
  const isNodeLanguage = language === 'typescript' || language === 'javascript';
  const backendIsNode = backend && NODE_BACKENDS.includes(backend as BackendId);
  const frontendIsNode = frontend && (FRONTEND_LANGUAGES[frontend as FrontendId] as string[] | undefined)?.some((l) => l === 'typescript' || l === 'javascript');
  const inferredNode = isNodeLanguage || backendIsNode || frontendIsNode;

  if (!inferredNode && language !== '') {
    for (const m of all) {
      if (['turborepo', 'nx', 'rush', 'pnpm-workspaces', 'yarn-workspaces', 'lerna'].includes(m.id)) {
        exclude(excluded, m.id, 'JavaScript monorepo tools require a JS/TS ecosystem');
      }
    }
  }

  return { catalog: all.filter((e) => !excluded[e.id]), pinnedDefault: 'none', excluded };
}

/** DESIGN — requires frontend */
export function filterDesignOptions<T extends string>(
  all: CatalogEntry<T>[],
  frontend: FrontendId | '',
): FilterResult<T> {
  const excluded: Record<string, string> = {};
  if (frontend === 'none' || frontend === '') {
    for (const c of all) {
      if (c.id !== 'none') {
        exclude(excluded, c.id, 'Design options require a frontend');
      }
    }
  }
  return { catalog: all.filter((e) => !excluded[e.id]), pinnedDefault: 'none' as T, excluded };
}