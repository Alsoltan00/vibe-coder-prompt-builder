// =====================================================================
//   WizardFilter — Cascading Dependency Resolution
//   ---------------------------------------------------------------------
//   Each catalog is filtered by current selections. Incompatible options
//   are HIDDEN (not just disabled) so the user literally CANNOT pick them.
//   When the user changes an early selection, downstream choices are
//   auto-reset to compatible defaults.
// =====================================================================

import type {
  ProjectData, ProjectTypeId, FrontendId, BackendId,
  DatabasePrimaryId, FrontendHostingId, BackendHostingId,
  DatabaseHostingId, AuthProviderId, UnitTestId, E2eTestId, PackageManagerId,
} from '../types';
import type { CatalogEntry } from './catalog/types';

export interface FilterResult<TId extends string> {
  catalog: CatalogEntry<TId>[];
  pinnedDefault: TId | '';
  reason: string;
  /** Why each excluded option was excluded (for tooltips) */
  excluded: Record<string, string>;
}

// =====================================================================
//   Per-category filters
// =====================================================================

/** Frontend options based on project type */
export function filterFrontends(
  all: CatalogEntry<FrontendId>[],
  projectType: ProjectTypeId | '',
): FilterResult<FrontendId> {
  const excluded: Record<string, string> = {};
  const exclude = (id: FrontendId, reason: string) => {
    excluded[id] = reason;
  };

  // Mobile-only stacks
  if (projectType === 'mobile-app') {
    for (const f of all) {
      if (
        !['react-native', 'expo', 'flutter', 'swiftui', 'jetpack-compose'].includes(f.id)
      ) {
        exclude(f.id, 'Mobile app → need a mobile frontend');
      }
    }
  }
  // Desktop-only stacks
  if (projectType === 'desktop-app') {
    for (const f of all) {
      if (!['tauri', 'electron'].includes(f.id)) {
        exclude(f.id, 'Desktop app → need Tauri or Electron');
      }
    }
  }
  // CLI / Library — no frontend
  if (projectType === 'cli-tool' || projectType === 'library-sdk' || projectType === 'api-backend') {
    for (const f of all) {
      if (f.id !== 'none') {
        exclude(f.id, 'This project type needs no UI');
      }
    }
  }
  // Chrome extension — frontend optional
  // Landing / Blog — Next.js / Astro / SvelteKit / Nuxt preferred

  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: filtered[0]?.id ?? '',
    reason: projectType === 'mobile-app' ? 'Mobile frontend only' : '',
    excluded,
  };
}

/** Backend options based on frontend choice */
export function filterBackends(
  all: CatalogEntry<BackendId>[],
  frontend: FrontendId | '',
  projectType: ProjectTypeId | '',
): FilterResult<BackendId> {
  const excluded: Record<string, string> = {};
  const exclude = (id: BackendId, reason: string) => {
    excluded[id] = reason;
  };

  // Full-stack frameworks — no backend
  if (['nextjs', 'remix', 'nuxt', 'sveltekit'].includes(frontend)) {
    for (const b of all) exclude(b.id, 'Full-stack framework has its own backend');
  }
  // Astro — no backend (it's static-first)
  if (frontend === 'astro') for (const b of all) exclude(b.id, 'Astro is static-first');
  // Desktop — backend bundled
  if (frontend === 'tauri' || frontend === 'electron') {
    for (const b of all) exclude(b.id, 'Desktop apps bundle the backend');
  }

  // CLI / library — no backend
  if (projectType === 'cli-tool' || projectType === 'library-sdk') {
    for (const b of all) exclude(b.id, 'No backend needed');
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: ['nextjs', 'remix', 'nuxt', 'sveltekit', 'astro', 'tauri', 'electron'].includes(frontend)
      ? 'none'
      : 'express',
    reason: '',
    excluded,
  };
}

/** Language options based on frontend + backend */
export function filterLanguages(
  all: CatalogEntry<any>[],
  frontend: FrontendId | '',
  backend: BackendId | '',
): FilterResult<any> {
  const excluded: Record<string, string> = {};
  const exclude = (id: string, reason: string) => {
    excluded[id] = reason;
  };

  // Map frontend → required language
  const frontendLang: Record<string, string> = {
    swiftui: 'swift',
    'jetpack-compose': 'kotlin',
    flutter: 'dart',
  };
  const forced = frontendLang[frontend];
  if (forced) {
    for (const l of all) if (l.id !== forced) exclude(l.id, `${frontend} requires ${forced}`);
  }

  // Backend → language constraints
  const backendLang: Record<string, string> = {
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
  };
  const required = backendLang[backend];
  if (required) {
    for (const l of all) if (l.id !== required) exclude(l.id, `${backend} requires ${required}`);
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: forced ?? required ?? 'typescript',
    reason: '',
    excluded,
  };
}

/** Database primary based on backend language */
export function filterPrimaryDatabases(
  all: CatalogEntry<DatabasePrimaryId>[],
  language: string,
  auth: AuthProviderId | '',
): FilterResult<DatabasePrimaryId> {
  const excluded: Record<string, string> = {};
  const exclude = (id: DatabasePrimaryId, reason: string) => {
    excluded[id] = reason;
  };

  // Backend language affects DB recommendations
  if (language === 'python' || language === 'ruby' || language === 'php') {
    // All major DBs work; nothing strict to exclude
  }
  // Supabase auth → strongly prefer supabase-db
  if (auth === 'supabase-auth') {
    // Don't hide others, but suggest default
  }
  // Firebase auth → strongly prefer Firestore
  if (auth === 'firebase-auth') {
    // Don't hide others
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: 'postgresql',
    reason: '',
    excluded,
  };
}

/** Vector DB based on primary DB (pgvector needs postgres) */
export function filterVectorDatabases(
  all: CatalogEntry<any>[],
  primaryDb: DatabasePrimaryId | '',
): FilterResult<any> {
  const excluded: Record<string, string> = {};
  const isPg = ['postgresql', 'supabase-db', 'neon'].includes(primaryDb as string);
  if (!isPg) {
    excluded['pgvector'] = 'Requires PostgreSQL';
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: 'none',
    reason: '',
    excluded,
  };
}

/** Time-series DB based on primary DB */
export function filterTimeSeriesDatabases(
  all: CatalogEntry<any>[],
  primaryDb: DatabasePrimaryId | '',
): FilterResult<any> {
  const excluded: Record<string, string> = {};
  const isPg = ['postgresql', 'supabase-db', 'neon'].includes(primaryDb as string);
  if (!isPg) {
    excluded['timescaledb'] = 'Requires PostgreSQL';
  }
  const filtered = all.filter((e) => !excluded[e.id]);
  return {
    catalog: filtered,
    pinnedDefault: 'none',
    reason: '',
    excluded,
  };
}

/** Frontend hosting based on frontend choice */
export function filterFrontendHostings(
  all: CatalogEntry<FrontendHostingId>[],
  frontend: FrontendId | '',
): FilterResult<FrontendHostingId> {
  const excluded: Record<string, string> = {};
  // Full-stack frameworks: Vercel/Netlify/CF Pages are best
  // Static-site frameworks (Astro): all options OK
  // SPA frameworks (React/Vue): all options OK
  // Mobile/Desktop: no frontend hosting needed
  if (
    [
      'react-native',
      'expo',
      'flutter',
      'swiftui',
      'jetpack-compose',
      'tauri',
      'electron',
    ].includes(frontend)
  ) {
    for (const f of all) excluded[f.id] = 'No frontend to host';
  }
  // 'none' filtered for web frontends
  if (
    !['none'].includes(frontend) &&
    !excluded['none']
  ) {
    // Keep "none" available but mark it
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  // Auto-pick best default for the frontend
  let def: FrontendHostingId | '' = '';
  if (['nextjs', 'remix'].includes(frontend)) def = 'vercel';
  else if (['nuxt'].includes(frontend)) def = 'vercel';
  else if (['sveltekit'].includes(frontend)) def = 'vercel';
  else if (['astro'].includes(frontend)) def = 'cloudflare-pages';
  else if (!excluded['vercel']) def = 'vercel';

  return { catalog: filtered, pinnedDefault: def, reason: '', excluded };
}

/** Backend hosting based on hosting */
export function filterBackendHostings(
  all: CatalogEntry<BackendHostingId>[],
  backend: BackendId | '',
  language: string,
): FilterResult<BackendHostingId> {
  const excluded: Record<string, string> = {};
  // No backend → no backend hosting
  if (backend === '' || backend === 'none') {
    for (const f of all) excluded[f.id] = 'No backend to host';
  }
  // Hono is the only one that works on Cloudflare Workers
  if (backend && backend !== 'hono' && backend !== 'none') {
    excluded['cloudflare-workers'] = 'Only Hono works on Cloudflare Workers';
  }
  // Spring / Django / Rails / etc → exclude Workers
  const nonEdgeBackend = ['spring-boot', 'django', 'fastapi', 'flask', 'rails', 'laravel', 'symfony', 'phoenix', 'aspnet', 'actix', 'axum', 'gin', 'echo', 'fiber'];
  if (nonEdgeBackend.includes(backend || '')) {
    for (const id of ['cloudflare-workers']) excluded[id] = 'Not compatible with backend choice';
  }

  const filtered = all.filter((e) => !excluded[e.id]);
  let def: BackendHostingId | '' = '';
  if (backend === 'hono') def = 'cloudflare-workers';
  else if (backend === 'none' || backend === '') def = 'none';
  else if (['fastapi', 'django', 'flask', 'express', 'fastify', 'nestjs'].includes(backend || '')) def = 'railway';

  return { catalog: filtered, pinnedDefault: def, reason: '', excluded };
}

/** Default the auth based on stack */
export function filterAuthProviders(
  all: CatalogEntry<AuthProviderId>[],
  frontend: FrontendId | '',
  primaryDb: DatabasePrimaryId | '',
): FilterResult<AuthProviderId> {
  const excluded: Record<string, string> = {};
  // Hardcoded nothing — user picks freely. But defaults…
  const filtered = all.filter((e) => !excluded[e.id]);
  let def: AuthProviderId | '' = '';
  if (primaryDb === 'supabase-db') def = 'supabase-auth';
  else if (frontend === 'nextjs') def = 'nextauth';
  else if (frontend === 'flutter' || frontend === 'expo' || frontend === 'react-native') def = 'clerk';
  else def = 'clerk';
  return { catalog: filtered, pinnedDefault: def, reason: '', excluded };
}
