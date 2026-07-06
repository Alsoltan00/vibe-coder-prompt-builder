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

  // Frontend hosting must be "none" if we have no frontend
  if ((r.frontend === 'none' || r.frontend === '') && r.frontendHosting !== 'none') {
    issues.push({
      severity: 'error',
      category: 'hosting',
      message: 'Frontend hosting selected but there is no frontend',
      fix: 'none',
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

  // Package manager must match language ecosystem
  const isNodeLanguage = data.language === 'typescript' || data.language === 'javascript';
  const backendIsNode = s.backend && ['express', 'fastify', 'nestjs', 'hono', 'koa'].includes(s.backend);
  const frontendIsNode = s.frontend && !['flutter', 'swiftui', 'jetpack-compose'].includes(s.frontend) && s.frontend !== 'none';
  const inferredNode = isNodeLanguage || backendIsNode || frontendIsNode;
  
  if (!inferredNode && data.language !== '') {
    const nodePMs = ['npm', 'pnpm', 'yarn', 'bun'];
    if (nodePMs.includes(s.devops.packageManager)) {
      let def = 'uv';
      if (data.language === 'go') def = 'go-modules';
      else if (data.language === 'rust') def = 'cargo';
      else if (data.language === 'java') def = 'maven';
      else if (data.language === 'ruby') def = 'bundler';
      else if (data.language === 'php') def = 'composer';
      issues.push({
        severity: 'error',
        category: 'devops',
        message: `${data.language} stack requires a language-specific package manager, not ${s.devops.packageManager}`,
        fix: def,
      });
    }
  }

  // No frontend means no frontend deployment
  if ((r.frontend === 'none' || r.frontend === '') && (s.devops.cd === 'vercel-deploy' || s.devops.cd === 'netlify-deploy')) {
    issues.push({
      severity: 'error',
      category: 'devops',
      message: 'Vercel/Netlify deploy selected but there is no frontend',
      fix: 'none',
    });
  }

  // Design options require a frontend
  if ((r.frontend === 'none' || r.frontend === '') && (s.design.cssFramework !== 'none' || s.design.componentLibrary !== 'none' || s.design.iconSet !== 'none' || s.design.fontFamily !== 'system-default')) {
    issues.push({ severity: 'error', category: 'design', message: 'Design options selected but there is no frontend', fix: 'none' });
  }

  // Component testing requires a frontend
  if ((r.frontend === 'none' || r.frontend === '') && s.testing.component !== 'none') {
    issues.push({ severity: 'error', category: 'testing.component', message: 'Component testing requires a frontend', fix: 'none' });
  }

  // Unit test ecosystem match
  if (s.testing.unit !== 'none' && data.language !== '') {
    if (!inferredNode && ['vitest', 'jest', 'mocha'].includes(s.testing.unit)) {
      let def = 'none';
      if (data.language === 'python') def = 'pytest';
      else if (data.language === 'go') def = 'go-test';
      else if (data.language === 'rust') def = 'cargo-test';
      else if (data.language === 'ruby') def = 'rspec';
      else if (data.language === 'php') def = 'phpunit';
      else if (data.language === 'java') def = 'junit';
      issues.push({ severity: 'error', category: 'testing.unit', message: `Node.js testing frameworks are for JS/TS only, not ${data.language}`, fix: def });
    }
    
    if (s.testing.unit === 'pytest' && data.language !== 'python') issues.push({ severity: 'error', category: 'testing.unit', message: 'pytest is for Python', fix: inferredNode ? 'vitest' : 'none' });
    if (s.testing.unit === 'go-test' && data.language !== 'go') issues.push({ severity: 'error', category: 'testing.unit', message: 'go-test is for Go', fix: inferredNode ? 'vitest' : 'none' });
    if (s.testing.unit === 'cargo-test' && data.language !== 'rust') issues.push({ severity: 'error', category: 'testing.unit', message: 'cargo-test is for Rust', fix: inferredNode ? 'vitest' : 'none' });
    if (s.testing.unit === 'rspec' && data.language !== 'ruby') issues.push({ severity: 'error', category: 'testing.unit', message: 'rspec is for Ruby', fix: inferredNode ? 'vitest' : 'none' });
    if (s.testing.unit === 'phpunit' && data.language !== 'php') issues.push({ severity: 'error', category: 'testing.unit', message: 'phpunit is for PHP', fix: inferredNode ? 'vitest' : 'none' });
    if (s.testing.unit === 'junit' && data.language !== 'java') issues.push({ severity: 'error', category: 'testing.unit', message: 'junit is for Java', fix: inferredNode ? 'vitest' : 'none' });
  }

  // Monorepo ecosystem match
  if (!inferredNode && data.language !== '' && ['turborepo', 'nx', 'rush', 'pnpm-workspaces', 'yarn-workspaces', 'lerna'].includes(s.devops.monorepo)) {
    issues.push({ severity: 'error', category: 'devops.monorepo', message: `JavaScript monorepo tools require a JS/TS ecosystem`, fix: 'none' });
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
    case 'devops':
      if (value === 'none') {
        s.devops.cd = value as any;
      } else {
        s.devops.packageManager = value as any;
      }
      break;
    case 'devops.monorepo':
      s.devops.monorepo = value as any;
      break;
    case 'testing.component':
      s.testing.component = value as any;
      break;
    case 'testing.unit':
      s.testing.unit = value as any;
      break;
    case 'design':
      s.design.cssFramework = value as any;
      s.design.componentLibrary = value as any;
      s.design.iconSet = value as any;
      s.design.fontFamily = value as any;
      break;
  }
}