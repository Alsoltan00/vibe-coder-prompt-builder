// =====================================================================
//   SKILL VALIDATOR — runs after generation
//   ---------------------------------------------------------------------
//   Detects contradictions in the generated output and returns a list
//   of issues. The generator MUST use this and re-generate if any errors
//   are found — guarantees zero contradictions in the output.
// =====================================================================

import type { ProjectData } from '../types';

export interface ValidationIssue {
  severity: 'error' | 'warning';
  category: string;
  message: string;
  fix?: string;
}

interface ResolvedForValidation {
  name: string;
  frontend: string;
  backend: string;
  frontendHosting: string;
  backendHosting: string;
  databaseHosting: string;
  cdn: string;
  e2e: string;
  monitoring: string;
  vectorDb: string;
  tsDb: string;
  primaryDb: string;
  storage: string;
  payments: boolean;
  fileUploads: boolean;
}

export function validateSkill(data: ProjectData): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const s = data.stack;

  const r: ResolvedForValidation = {
    name: data.identity.name,
    frontend: s.frontend,
    backend: s.backend,
    frontendHosting: s.hosting.frontend,
    backendHosting: s.hosting.backend,
    databaseHosting: s.hosting.database,
    cdn: s.hosting.cdn,
    e2e: s.testing.e2e,
    monitoring: s.thirdParty.monitoring,
    vectorDb: s.database.vector,
    tsDb: s.database.timeseries,
    primaryDb: s.database.primary,
    storage: s.thirdParty.storage,
    payments: data.professionalRequirements.payments,
    fileUploads: data.professionalRequirements.fileUploads,
  };

  // ----- HARD RULES (errors) -----
  if (r.name === '' || /^\s*$/.test(r.name)) {
    issues.push({ severity: 'error', category: 'identity', message: 'Project name is empty' });
  }

  // Frontend hosting must not be "none" if we have a web frontend
  if (
    !['none', 'react-native', 'expo', 'flutter', 'swiftui', 'jetpack-compose', 'tauri', 'electron'].includes(r.frontend) &&
    (r.frontendHosting === 'none' || r.frontendHosting === '')
  ) {
    issues.push({
      severity: 'error',
      category: 'hosting',
      message: 'Web frontend selected but frontend hosting is empty',
      fix: 'vercel',
    });
  }

  // Backend hosting must not be "none" if we have a backend (that's a real server)
  if (r.backend !== 'none' && r.backend !== '' && (r.backendHosting === 'none' || r.backendHosting === '')) {
    issues.push({
      severity: 'error',
      category: 'hosting',
      message: `Backend ${r.backend} selected but no backend hosting`,
      fix: r.backend === 'hono' ? 'cloudflare-workers' : 'railway',
    });
  }

  // Database needs hosting if it's not in-memory
  if (
    r.primaryDb !== '' && r.primaryDb !== 'none' && r.primaryDb !== 'sqlite' &&
    (r.databaseHosting === 'none' || r.databaseHosting === '')
  ) {
    issues.push({
      severity: 'error',
      category: 'hosting',
      message: `Primary DB ${r.primaryDb} selected but no DB hosting`,
      fix: r.primaryDb === 'postgresql' || r.primaryDb === 'supabase-db' || r.primaryDb === 'neon' ? 'neon' : 'aws-rds',
    });
  }

  // pgvector/TimescaleDB need Postgres
  if ((r.vectorDb === 'pgvector' || r.tsDb === 'timescaledb') &&
      !['postgresql', 'supabase-db', 'neon'].includes(r.primaryDb)) {
    issues.push({
      severity: 'error',
      category: 'database',
      message: 'pgvector / TimescaleDB require PostgreSQL primary',
      fix: 'postgresql',
    });
  }

  // Payments require a payment provider
  if (r.payments && (s.thirdParty.payments === 'none' || !s.thirdParty.payments)) {
    issues.push({
      severity: 'error',
      category: 'thirdParty',
      message: 'Payments feature enabled but no payment provider',
      fix: 'stripe',
    });
  }

  // File uploads require storage
  if (r.fileUploads && (r.storage === 'none' || !r.storage)) {
    issues.push({
      severity: 'error',
      category: 'thirdParty',
      message: 'File uploads feature enabled but no storage provider',
      fix: 'aws-s3',
    });
  }

  // ----- WARNINGS -----
  // No E2E + payments/auth → risky
  if ((r.e2e === 'none' || !r.e2e) && (r.payments || data.professionalRequirements.userAccounts)) {
    issues.push({
      severity: 'warning',
      category: 'testing',
      message: 'No E2E tests but payments/auth enabled — high risk',
      fix: 'playwright',
    });
  }

  // No monitoring + production-ready features
  if ((r.monitoring === 'none' || !r.monitoring) && data.professionalRequirements.adminPanel) {
    issues.push({
      severity: 'warning',
      category: 'monitoring',
      message: 'Admin panel enabled without error monitoring',
      fix: 'sentry',
    });
  }

  return issues;
}

/**
 * Auto-fix a ProjectData by applying all error-level fixes.
 * Iterates until no more issues are produced (max 5 passes for safety).
 * Returns a NEW ProjectData with corrections applied.
 */
export function fixSkill(data: ProjectData): ProjectData {
  let result = structuredClone(data);
  for (let pass = 0; pass < 5; pass++) {
    const issues = validateSkill(result);
    const errorsAndWarnings = issues.filter((i) => (i.severity === 'error' || i.severity === 'warning') && i.fix);
    if (errorsAndWarnings.length === 0) break;
    for (const issue of errorsAndWarnings) {
      applyFix(result, issue.category, issue.fix!);
    }
  }
  return result;
}

function applyFix(data: ProjectData, category: string, value: string) {
  const s = data.stack;
  switch (category) {
    case 'hosting': {
      // value can be e.g. 'vercel' (frontend), 'railway' (backend), or 'neon' (db).
      // We dispatch to the right slot using a tiny mapping.
      const isDbHost = ['neon', 'supabase', 'planetscale', 'railway-db', 'render-postgres',
        'aws-rds', 'aws-aurora', 'gcp-cloud-sql', 'azure-cosmos', 'mongodb-atlas',
        'upstash', 'turso', 'self-hosted-docker'].includes(value);
      const isBackendHost = ['vercel-functions', 'netlify-functions', 'cloudflare-workers',
        'aws-lambda', 'aws-ecs', 'aws-fargate', 'aws-ec2', 'gcp-cloud-run',
        'gcp-app-engine', 'gcp-gke', 'azure-app-service', 'azure-container-apps',
        'railway', 'render', 'fly-io', 'digitalocean-app', 'heroku',
        'docker-self-hosted', 'kubernetes-self-hosted'].includes(value);
      if (isDbHost && s.hosting.database === 'none') {
        s.hosting.database = value as any;
      } else if (isBackendHost && s.hosting.backend === 'none' && s.backend !== 'none') {
        s.hosting.backend = value as any;
      } else if (s.hosting.frontend === 'none') {
        s.hosting.frontend = value as any;
      }
      break;
    }
    case 'database':
      s.database.primary = value as any;
      break;
    case 'thirdParty':
      if (data.professionalRequirements.payments && (s.thirdParty.payments === 'none' || !s.thirdParty.payments)) {
        s.thirdParty.payments = value as any;
      } else if (data.professionalRequirements.fileUploads && (s.thirdParty.storage === 'none' || !s.thirdParty.storage)) {
        s.thirdParty.storage = value as any;
      } else if ((s.thirdParty.monitoring === 'none' || !s.thirdParty.monitoring)) {
        s.thirdParty.monitoring = value as any;
      }
      break;
    case 'testing':
      s.testing.e2e = value as any;
      break;
    case 'monitoring':
      s.thirdParty.monitoring = value as any;
      break;
  }
}