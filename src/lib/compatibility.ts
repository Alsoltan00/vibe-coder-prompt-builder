// =====================================================================
//   Compatibility Engine
//   ---------------------------------------------------------------------
//   Defines rules that prevent the user from choosing combinations
//   that would produce a broken, ambiguous, or contradictory spec.
//   Each rule returns a severity (block / warn / info) and a localized
//   message explaining the problem and the recommended fix.
// =====================================================================

import type {
  ProjectData,
  ProjectTypeId,
  FrontendId,
  BackendId,
  DatabasePrimaryId,
  FrontendHostingId,
  BackendHostingId,
  AuthProviderId,
} from '@/types';

export type Severity = 'block' | 'warn' | 'info';

export interface CompatibilityIssue {
  id: string;
  severity: Severity;
  field: string; // dot-path e.g. "stack.frontend"
  message: string; // already localized to current UI language
  fix?: string; // suggested correction (option id)
}

interface Rule {
  id: string;
  severity: Severity;
  appliesTo: (data: ProjectData) => boolean;
  check: (data: ProjectData) => Omit<CompatibilityIssue, 'id' | 'severity' | 'message'> | null;
  message: (data: ProjectData) => string;
}

const RULES: Rule[] = [
  // -------------------------------------------------------------------
  // 1. Frontend full-stack frameworks negate the need for a backend
  // -------------------------------------------------------------------
  {
    id: 'fullstack-no-backend',
    severity: 'block',
    appliesTo: (d) =>
      d.stack.frontend === 'nextjs' ||
      d.stack.frontend === 'remix' ||
      d.stack.frontend === 'nuxt' ||
      d.stack.frontend === 'sveltekit',
    check: (d) =>
      d.stack.backend !== 'none'
        ? {
            field: 'stack.backend',
            fix: 'none',
          }
        : null,
    message: () =>
      'This frontend (Next.js / Remix / Nuxt / SvelteKit) is a full-stack framework — pick `none` for backend or the backend options will be ignored.',
  },
  {
    id: 'fullstack-hosting-required',
    severity: 'info',
    appliesTo: (d) =>
      d.stack.frontend === 'nextjs' ||
      d.stack.frontend === 'remix' ||
      d.stack.frontend === 'nuxt' ||
      d.stack.frontend === 'sveltekit',
    check: (d) =>
      d.stack.hosting.backend !== 'none' &&
      d.stack.hosting.frontend !== 'vercel' &&
      d.stack.hosting.frontend !== 'netlify' &&
      d.stack.hosting.frontend !== 'cloudflare-pages'
        ? { field: 'stack.hosting.frontend' }
        : null,
    message: () =>
      'Full-stack frameworks deploy best to Vercel / Netlify / Cloudflare Pages. A custom backend host may be unnecessary.',
  },

  // -------------------------------------------------------------------
  // 2. Static-only frontend → no backend, no DB, no auth-as-a-service
  // -------------------------------------------------------------------
  {
    id: 'astro-static',
    severity: 'block',
    appliesTo: (d) => d.stack.frontend === 'astro',
    check: (d) =>
      d.stack.backend !== 'none'
        ? { field: 'stack.backend', fix: 'none' }
        : null,
    message: () => 'Astro is a static-first framework — the backend must be `none`.',
  },

  // -------------------------------------------------------------------
  // 3. Mobile native frameworks are bound to specific languages
  // -------------------------------------------------------------------
  {
    id: 'swiftui-needs-swift',
    severity: 'block',
    appliesTo: (d) => d.stack.frontend === 'swiftui',
    check: (d) =>
      d.language !== '' && d.language !== 'swift'
        ? { field: 'language', fix: 'swift' }
        : null,
    message: () => 'SwiftUI requires Swift as the primary language.',
  },
  {
    id: 'compose-needs-kotlin',
    severity: 'block',
    appliesTo: (d) => d.stack.frontend === 'jetpack-compose',
    check: (d) =>
      d.language !== '' && d.language !== 'kotlin'
        ? { field: 'language', fix: 'kotlin' }
        : null,
    message: () => 'Jetpack Compose requires Kotlin.',
  },
  {
    id: 'flutter-needs-dart',
    severity: 'block',
    appliesTo: (d) => d.stack.frontend === 'flutter',
    check: (d) =>
      d.language !== '' && d.language !== 'dart'
        ? { field: 'language', fix: 'dart' }
        : null,
    message: () => 'Flutter requires Dart as the primary language.',
  },

  // -------------------------------------------------------------------
  // 4. Backend language coherence
  // -------------------------------------------------------------------
  {
    id: 'django-needs-python',
    severity: 'block',
    appliesTo: (d) =>
      d.stack.backend === 'django' ||
      d.stack.backend === 'fastapi' ||
      d.stack.backend === 'flask',
    check: (d) =>
      d.language !== '' && d.language !== 'python'
        ? { field: 'language', fix: 'python' }
        : null,
    message: () => 'Python backend frameworks require Python as the language.',
  },
  {
    id: 'spring-needs-java',
    severity: 'block',
    appliesTo: (d) => d.stack.backend === 'spring-boot',
    check: (d) =>
      d.language !== '' && d.language !== 'java' && d.language !== 'kotlin'
        ? { field: 'language', fix: 'java' }
        : null,
    message: () => 'Spring Boot requires Java or Kotlin.',
  },
  {
    id: 'rails-needs-ruby',
    severity: 'block',
    appliesTo: (d) => d.stack.backend === 'rails',
    check: (d) =>
      d.language !== '' && d.language !== 'ruby'
        ? { field: 'language', fix: 'ruby' }
        : null,
    message: () => 'Ruby on Rails requires Ruby.',
  },
  {
    id: 'laravel-needs-php',
    severity: 'block',
    appliesTo: (d) => d.stack.backend === 'laravel' || d.stack.backend === 'symfony',
    check: (d) =>
      d.language !== '' && d.language !== 'php'
        ? { field: 'language', fix: 'php' }
        : null,
    message: () => 'PHP frameworks require PHP.',
  },
  {
    id: 'phoenix-needs-elixir',
    severity: 'block',
    appliesTo: (d) => d.stack.backend === 'phoenix',
    check: (d) =>
      d.language !== '' && d.language !== 'elixir'
        ? { field: 'language', fix: 'elixir' }
        : null,
    message: () => 'Phoenix requires Elixir.',
  },
  {
    id: 'rust-backends-need-rust',
    severity: 'block',
    appliesTo: (d) => d.stack.backend === 'actix' || d.stack.backend === 'axum',
    check: (d) =>
      d.language !== '' && d.language !== 'rust'
        ? { field: 'language', fix: 'rust' }
        : null,
    message: () => 'Rust backends (Actix / Axum) require Rust.',
  },
  {
    id: 'gin-echo-fiber-need-go',
    severity: 'block',
    appliesTo: (d) =>
      d.stack.backend === 'gin' ||
      d.stack.backend === 'echo' ||
      d.stack.backend === 'fiber',
    check: (d) =>
      d.language !== '' && d.language !== 'go'
        ? { field: 'language', fix: 'go' }
        : null,
    message: () => 'Go backends (Gin / Echo / Fiber) require Go.',
  },

  // -------------------------------------------------------------------
  // 5. Edge runtimes → compatible backends only
  // -------------------------------------------------------------------
  {
    id: 'cloudflare-workers-backend',
    severity: 'warn',
    appliesTo: (d) => d.stack.hosting.backend === 'cloudflare-workers',
    check: (d) => {
      const incompatible: BackendId[] = [
        'spring-boot', 'django', 'rails', 'flask', 'fastapi',
        'laravel', 'symfony', 'phoenix', 'actix', 'axum',
        'aspnet', 'gin', 'echo', 'fiber',
      ];
      return incompatible.includes(d.stack.backend)
        ? { field: 'stack.backend', fix: 'hono' }
        : null;
    },
    message: () =>
      'Cloudflare Workers run on V8 isolates — incompatible with traditional Node/Python/Java/Ruby backends. Use Hono for Cloudflare.',
  },

  // -------------------------------------------------------------------
  // 6. pgvector & TimescaleDB need Postgres
  // -------------------------------------------------------------------
  {
    id: 'pgvector-needs-postgres',
    severity: 'block',
    appliesTo: (d) => d.stack.database.vector === 'pgvector',
    check: (d) =>
      d.stack.database.primary !== 'postgresql' && d.stack.database.primary !== 'supabase-db' && d.stack.database.primary !== 'neon'
        ? { field: 'stack.database.primary', fix: 'postgresql' }
        : null,
    message: () => 'pgvector is a Postgres extension — primary DB must be PostgreSQL / Supabase / Neon.',
  },
  {
    id: 'timescaledb-needs-postgres',
    severity: 'block',
    appliesTo: (d) => d.stack.database.timeseries === 'timescaledb',
    check: (d) =>
      d.stack.database.primary !== 'postgresql' && d.stack.database.primary !== 'supabase-db' && d.stack.database.primary !== 'neon'
        ? { field: 'stack.database.primary', fix: 'postgresql' }
        : null,
    message: () => 'TimescaleDB is a Postgres extension — primary DB must be PostgreSQL.',
  },

  // -------------------------------------------------------------------
  // 7. Auth coherence
  // -------------------------------------------------------------------
  {
    id: 'supabase-auth-with-supabase-db',
    severity: 'info',
    appliesTo: (d) => d.stack.auth.primary === 'supabase-auth',
    check: (d) =>
      d.stack.database.primary !== 'supabase-db'
        ? { field: 'stack.database.primary', fix: 'supabase-db' }
        : null,
    message: () =>
      'Supabase Auth is optimized for Supabase Postgres (RLS, etc.) — consider Supabase DB.',
  },
  {
    id: 'firebase-auth-with-firestore',
    severity: 'info',
    appliesTo: (d) => d.stack.auth.primary === 'firebase-auth',
    check: (d) =>
      d.stack.database.primary !== 'firestore'
        ? { field: 'stack.database.primary', fix: 'firestore' }
        : null,
    message: () =>
      'Firebase Auth integrates natively with Firestore — consider Firestore as primary DB.',
  },
  {
    id: 'clerk-without-user-accounts',
    severity: 'info',
    appliesTo: (d) => d.stack.auth.primary === 'clerk',
    check: (d) => (d.professionalRequirements.userAccounts ? null : { field: 'professionalRequirements.userAccounts' }),
    message: () => 'Clerk is for user accounts — enable the User Accounts professional feature.',
  },

  // -------------------------------------------------------------------
  // 8. Search providers imply their own managed search
  // -------------------------------------------------------------------
  {
    id: 'duplicate-search',
    severity: 'info',
    appliesTo: (d) => d.stack.thirdParty.search !== 'none' && d.stack.database.search !== 'none',
    check: () => ({ field: 'stack.database.search', fix: 'none' }),
    message: () =>
      'You selected both a managed search (Algolia etc.) AND a database search engine — pick one to avoid paying twice.',
  },

  // -------------------------------------------------------------------
  // 9. CDN coherence
  // -------------------------------------------------------------------
  {
    id: 'cloudflare-pages-implies-cdn',
    severity: 'info',
    appliesTo: (d) => d.stack.hosting.frontend === 'cloudflare-pages' && d.stack.hosting.cdn !== 'cloudflare',
    check: () => ({ field: 'stack.hosting.cdn', fix: 'cloudflare' }),
    message: () =>
      'Cloudflare Pages includes the Cloudflare CDN — selecting a different CDN is redundant.',
  },

  // -------------------------------------------------------------------
  // 10. Tauri / Electron — no separate backend host
  // -------------------------------------------------------------------
  {
    id: 'tauri-electron-hosting',
    severity: 'warn',
    appliesTo: (d) => d.stack.frontend === 'tauri' || d.stack.frontend === 'electron',
    check: (d) =>
      d.stack.hosting.backend !== 'none'
        ? { field: 'stack.hosting.backend', fix: 'none' }
        : null,
    message: () =>
      'Desktop apps (Tauri / Electron) ship with the backend bundled — pick `none` for backend hosting.',
  },

  // -------------------------------------------------------------------
  // 11. Project type alignment
  // -------------------------------------------------------------------
  {
    id: 'mobile-app-needs-mobile-frontend',
    severity: 'block',
    appliesTo: (d) => d.identity.projectType === 'mobile-app',
    check: (d) => {
      const webOnly: FrontendId[] = ['nextjs', 'remix', 'nuxt', 'sveltekit', 'astro'];
      return webOnly.includes(d.stack.frontend)
        ? { field: 'stack.frontend' }
        : null;
    },
    message: () => 'Mobile app projects need a mobile frontend (React Native, Expo, Flutter, SwiftUI, or Jetpack Compose).',
  },
  {
    id: 'desktop-app-needs-desktop-frontend',
    severity: 'warn',
    appliesTo: (d) => d.identity.projectType === 'desktop-app',
    check: (d) =>
      d.stack.frontend !== 'tauri' && d.stack.frontend !== 'electron'
        ? { field: 'stack.frontend', fix: 'tauri' }
        : null,
    message: () => 'Desktop app projects typically use Tauri or Electron.',
  },
  {
    id: 'cli-tool-needs-cli-frontend',
    severity: 'warn',
    appliesTo: (d) => d.identity.projectType === 'cli-tool',
    check: (d) =>
      d.stack.frontend !== 'none'
        ? { field: 'stack.frontend', fix: 'none' }
        : null,
    message: () => 'CLI tools don\'t need a UI frontend — pick `none`.',
  },
  {
    id: 'ai-ml-app-suggests-vector',
    severity: 'info',
    appliesTo: (d) => d.identity.projectType === 'ai-ml-app',
    check: (d) =>
      d.stack.database.vector === 'none' ? { field: 'stack.database.vector', fix: 'pgvector' } : null,
    message: () => 'AI/ML apps usually need a vector database (pgvector, Pinecone, etc.).',
  },

  // -------------------------------------------------------------------
  // 12. Professional feature sanity
  // -------------------------------------------------------------------
  {
    id: 'payments-needs-payment-provider',
    severity: 'warn',
    appliesTo: (d) => d.professionalRequirements.payments,
    check: (d) =>
      d.stack.thirdParty.payments === 'none' ? { field: 'stack.thirdParty.payments', fix: 'stripe' } : null,
    message: () => 'You marked "Payments" as required but didn\'t select a payment provider.',
  },
  {
    id: 'admin-needs-auth',
    severity: 'warn',
    appliesTo: (d) => d.professionalRequirements.adminPanel,
    check: (d) =>
      d.stack.auth.primary === '' || d.stack.auth.primary === 'none'
        ? { field: 'stack.auth.primary', fix: 'clerk' }
        : null,
    message: () => 'Admin panel requires authentication.',
  },
  {
    id: 'realtime-needs-realtime-stack',
    severity: 'info',
    appliesTo: (d) => d.professionalRequirements.realTimeFeatures,
    check: (d) => {
      const realtimeFriendly: DatabasePrimaryId[] = ['postgresql', 'mongodb', 'supabase-db', 'firestore', 'neon'];
      return !realtimeFriendly.includes(d.stack.database.primary) ? { field: 'stack.database.primary' } : null;
    },
    message: () =>
      'Real-time features work best with Postgres + LISTEN/NOTIFY or Supabase/Firestore realtime.',
  },
];

export function evaluateCompatibility(data: ProjectData): CompatibilityIssue[] {
  const issues: CompatibilityIssue[] = [];
  for (const rule of RULES) {
    if (!rule.appliesTo(data)) continue;
    const found = rule.check(data);
    if (found) {
      issues.push({
        id: rule.id,
        severity: rule.severity,
        field: found.field,
        message: rule.message(data),
        fix: found.fix,
      });
    }
  }
  return issues;
}

export function hasBlocker(issues: CompatibilityIssue[]): boolean {
  return issues.some((i) => i.severity === 'block');
}

/**
 * Auto-fix the data by applying suggested `fix` values for all `block`-level
 * issues. Returns a new ProjectData.
 */
export function autoFix(data: ProjectData): ProjectData {
  const issues = evaluateCompatibility(data);
  const result = structuredClone(data);

  for (const issue of issues) {
    if (issue.severity !== 'block' || !issue.fix) continue;
    applyFix(result, issue.field, issue.fix);
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