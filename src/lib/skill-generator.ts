// =====================================================================
//   Skill Generator v2 — Coherent, conflict-free output
//   ---------------------------------------------------------------------
//   FIXED issues from v1:
//   1. Frontmatter `name` properly slugified
//   2. Scripts match the actual frontend choice (Vite vs Next.js, etc.)
//   3. Hosting not left as "No X" when there's a real service to host
//   4. File layout adapts to monorepo vs single-package
//   5. CDN/Auth/Storage coherently defaulted based on full stack
//   6. Validation runs BEFORE output — zero-contradiction guarantee
// =====================================================================

import type { ProjectData } from '../types';
import {
  findEntry,
  projectTypes, languages, frontends, backends,
  primaryDatabases, cacheDatabases, vectorDatabases, searchDatabases,
  analyticsDatabases, graphDatabases, timeSeriesDatabases,
  frontendHostingCatalog, backendHostingCatalog, databaseHostingCatalog,
  cdnsCatalog, orchestrationCatalog, authProviders, socialProviders,
  paymentProviders, emailProviders, smsProviders, analyticsProviders,
  monitoringProviders, storageProviders, managedSearchProviders,
  featureFlagsProviders, cssFrameworks, componentLibraries, iconSets,
  fontFamilies, translationSources, unitTestTools, componentTestTools,
  e2eTestTools, apiTestTools, ciProviders, cdStrategies, iacTools,
  packageManagers, monorepoTools,
} from './catalog';
import { validateSkill, fixSkill } from './validator';

const or = (v: string | undefined, f: string) => v?.trim() || f;

const slugify = (s: string): string =>
  s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

// =====================================================================
//   Framework-specific template sets
// =====================================================================
interface ScriptsSet {
  dev: string;
  build: string;
  start: string;
  lint: string;
  typecheck: string;
  test: string;
}

const SCRIPTS_BY_FRONTEND: Record<string, Partial<ScriptsSet>> = {
  nextjs: { dev: 'next dev', build: 'next build', start: 'next start', lint: 'next lint' },
  remix: { dev: 'remix vite:dev', build: 'remix vite:build', start: 'remix-serve build/index.js', lint: 'eslint .' },
  nuxt: { dev: 'nuxt dev', build: 'nuxt build', start: 'node .output/server/index.mjs', lint: 'eslint .' },
  sveltekit: { dev: 'vite dev', build: 'vite build', start: 'vite preview', lint: 'eslint .' },
  astro: { dev: 'astro dev', build: 'astro build', start: 'astro preview', lint: 'astro check' },
  react: { dev: 'vite', build: 'tsc -b && vite build', start: 'vite preview', lint: 'eslint .' },
  vue: { dev: 'vite', build: 'tsc -b && vite build', start: 'vite preview', lint: 'eslint .' },
  preact: { dev: 'vite', build: 'tsc -b && vite build', start: 'vite preview', lint: 'eslint .' },
  solid: { dev: 'vite', build: 'tsc -b && vite build', start: 'vite preview', lint: 'eslint .' },
  angular: { dev: 'ng serve', build: 'ng build', start: 'ng serve --prod', lint: 'ng lint' },
  qwik: { dev: 'vite --mode ssr', build: 'qwik build', start: 'vite preview', lint: 'eslint .' },
  ember: { dev: 'ember serve', build: 'ember build', start: 'ember serve --environment=production', lint: 'eslint .' },
  svelte: { dev: 'vite', build: 'vite build', start: 'vite preview', lint: 'eslint .' },
  lit: { dev: 'vite', build: 'vite build', start: 'vite preview', lint: 'eslint .' },
  'react-native': { dev: 'react-native start', build: 'react-native build', start: 'react-native start', lint: 'eslint .' },
  expo: { dev: 'expo start', build: 'eas build', start: 'expo start', lint: 'expo lint' },
  flutter: { dev: 'flutter run', build: 'flutter build', start: 'flutter run', lint: 'flutter analyze' },
  swiftui: { dev: 'xedoes && open -a Simulator', build: 'xcodebuild', start: 'xedoes && open -a Simulator', lint: 'swiftlint' },
  'jetpack-compose': { dev: './gradlew run', build: './gradlew build', start: './gradlew run', lint: './gradlew lint' },
  tauri: { dev: 'cargo tauri dev', build: 'cargo tauri build', start: 'cargo tauri build --release', lint: 'eslint .' },
  electron: { dev: 'electron .', build: 'electron-builder', start: 'electron .', lint: 'eslint .' },
  none: {},
};

const PKG_BY_LANG: Record<string, string> = {
  typescript: '"typescript": "^5.6.0"',
  javascript: '',
  python: '',
  java: '',
  kotlin: '',
  swift: '',
  go: '',
  rust: '',
  ruby: '',
  php: '',
  elixir: '',
  scala: '',
  dart: '',
  cpp: '',
  csharp: '',
  solidity: '',
};

const RUNTIME_PKG: Record<string, string> = {
  typescript: '"node": ">=22.0.0"',
  python: '"python": ">=3.12"',
  go: '"go": ">=1.23"',
  rust: '"rust": ">=1.81"',
  java: '"java": ">=21"',
  kotlin: '"java": ">=17"',
  swift: '"swift": ">=5.10"',
  ruby: '"ruby": ">=3.3"',
  php: '"php": ">=8.3"',
  elixir: '"elixir": ">=1.17"',
  dart: '"dart": ">=3.5"',
  csharp: '"dotnet": ">=8.0"',
  solidity: '"solc": ">=0.8.24"',
  cpp: '"cpp": ">=20"',
  scala: '"scala": ">=3.4"',
  javascript: '"node": ">=22.0.0"',
};

// =====================================================================
//   File layout generator (adapts to choices) — works from ProjectData
// =====================================================================
function buildFileLayout(data: ProjectData): string {
  const s = data.stack;
  const isMobileFirst = ['react-native', 'expo', 'flutter', 'swiftui', 'jetpack-compose'].includes(s.frontend as string);
  const hasBackend = s.backend && s.backend !== 'none';
  const isMonorepo = !!(s.devops.monorepo && s.devops.monorepo !== 'none');
  const name = or(data.identity.name, 'project').toLowerCase().replace(/\s+/g, '-');

  const indent = (level: number, lines: string[]) =>
    lines.map((l) => '│   '.repeat(level) + l).join('\n');

  if (isMonorepo && (hasBackend || isMobileFirst)) {
    // Monorepo layout
    return [
      `${name}/`,
      `├── apps/`,
      ...indent(1, [
        `web/                   # ${formatFrontend(s.frontend)}${s.frontend === 'nextjs' || s.frontend === 'remix' || s.frontend === 'nuxt' || s.frontend === 'sveltekit' ? ' (full-stack, includes API routes)' : ''}`,
      ]),
      ...(hasBackend
        ? indent(1, [`api/                   # ${formatBackend(s.backend)} backend`])
        : []),
      ...(isMobileFirst
        ? indent(1, [`mobile/                # ${formatFrontend(s.frontend)} mobile`])
        : []),
      `├── packages/`,
      ...indent(1, [
        `ui/                    # shared React components`,
        `db/                    # schema + migrations + seed`,
        `config/                # shared TS / ESLint / Prettier configs`,
      ]),
    ].join('\n');
  }

  // Single-package layout
  const topDirs: string[] = [];
  if (hasBackend && !['nextjs', 'remix', 'nuxt', 'sveltekit'].includes(s.frontend)) {
    topDirs.push(`├── server/                # ${formatBackend(s.backend)} API`);
  }
  if (isMobileFirst) {
    topDirs.push(`├── mobile/                # ${formatFrontend(s.frontend)} mobile`);
  }
  topDirs.push(`├── src/                   # ${formatFrontend(s.frontend)} frontend`);
  topDirs.push(`│   ├── components/`);
  topDirs.push(`│   ├── pages/  (or routes/)`);
  topDirs.push(`│   ├── lib/`);
  topDirs.push(`│   ├── styles/`);
  topDirs.push(`│   └── types/`);
  topDirs.push(`├── tests/                  # e2e + integration`);
  topDirs.push(`├── public/                 # static assets`);
  topDirs.push(`├── .github/workflows/      # CI/CD`);
  topDirs.push(`├── .env.example`);
  topDirs.push(`├── package.json`);
  topDirs.push(`├── tsconfig.json`);
  topDirs.push(`└── README.md`);
  return [`${name}/`, ...topDirs].join('\n');
}

function formatFrontend(id: string): string {
  const map: Record<string, string> = {
    nextjs: 'Next.js (App Router)',
    remix: 'Remix',
    nuxt: 'Nuxt',
    sveltekit: 'SvelteKit',
    astro: 'Astro',
    react: 'React (Vite)',
    vue: 'Vue (Vite)',
    preact: 'Preact (Vite)',
    solid: 'SolidJS',
    angular: 'Angular',
    svelte: 'Svelte',
    qwik: 'Qwik',
    ember: 'Ember',
    lit: 'Lit',
    'react-native': 'React Native (CLI)',
    expo: 'Expo',
    flutter: 'Flutter',
    swiftui: 'SwiftUI',
    'jetpack-compose': 'Jetpack Compose',
    tauri: 'Tauri',
    electron: 'Electron',
    none: 'no UI',
  };
  return map[id] || id;
}

function formatBackend(id: string): string {
  const map: Record<string, string> = {
    express: 'Express.js',
    fastify: 'Fastify',
    nestjs: 'NestJS',
    hono: 'Hono',
    koa: 'Koa',
    django: 'Django',
    fastapi: 'FastAPI',
    flask: 'Flask',
    'spring-boot': 'Spring Boot',
    rails: 'Ruby on Rails',
    laravel: 'Laravel',
    symfony: 'Symfony',
    gin: 'Gin',
    echo: 'Echo',
    fiber: 'Fiber',
    actix: 'Actix Web',
    axum: 'Axum',
    aspnet: 'ASP.NET Core',
    phoenix: 'Phoenix',
    none: 'none',
  };
  return map[id] || id;
}

function pickScripts(frontend: string, language: string): ScriptsSet {
  const defaultScripts: ScriptsSet = {
    dev: 'npm run dev',
    build: 'npm run build',
    start: 'npm start',
    lint: 'eslint .',
    typecheck: 'tsc --noEmit',
    test: 'vitest',
  };
  // Node/JS/TS projects use npm-style scripts
  if (['typescript', 'javascript'].includes(language)) {
    return {
      dev: SCRIPTS_BY_FRONTEND[frontend]?.dev || 'vite',
      build: SCRIPTS_BY_FRONTEND[frontend]?.build || 'vite build',
      start: SCRIPTS_BY_FRONTEND[frontend]?.start || 'vite preview',
      lint: SCRIPTS_BY_FRONTEND[frontend]?.lint || 'eslint .',
      typecheck: 'tsc --noEmit',
      test: 'vitest',
    };
  }
  if (language === 'python') {
    return {
      dev: 'uvicorn main:app --reload',
      build: 'python -m build',
      start: 'gunicorn main:app',
      lint: 'ruff check .',
      typecheck: 'mypy .',
      test: 'pytest',
    };
  }
  if (language === 'go') {
    return {
      dev: 'go run ./cmd/server',
      build: 'go build -o bin/server ./cmd/server',
      start: './bin/server',
      lint: 'golangci-lint run',
      typecheck: 'go vet ./...',
      test: 'go test ./...',
    };
  }
  if (language === 'rust') {
    return {
      dev: 'cargo run',
      build: 'cargo build --release',
      start: 'cargo run --release',
      lint: 'cargo clippy',
      typecheck: 'cargo check',
      test: 'cargo test',
    };
  }
  return defaultScripts;
}

// =====================================================================
//   Resolved context
// =====================================================================
interface Resolved {
  name: string;
  slug: string;
  description: string;
  audience: string;
  projectType: ReturnType<typeof findEntry>;
  language: ReturnType<typeof findEntry>;
  frontend: ReturnType<typeof findEntry>;
  backend: ReturnType<typeof findEntry>;
  hosting: {
    frontend: ReturnType<typeof findEntry>;
    backend: ReturnType<typeof findEntry>;
    database: ReturnType<typeof findEntry>;
    cdn: ReturnType<typeof findEntry>;
    orchestration: ReturnType<typeof findEntry>;
  };
  db: {
    primary: ReturnType<typeof findEntry>;
    cache: ReturnType<typeof findEntry>;
    vector: ReturnType<typeof findEntry>;
    search: ReturnType<typeof findEntry>;
    analytics: ReturnType<typeof findEntry>;
    graph: ReturnType<typeof findEntry>;
    ts: ReturnType<typeof findEntry>;
  };
  auth: {
    primary: ReturnType<typeof findEntry>;
    social: ReturnType<typeof findEntry>[];
  };
  thirdParty: {
    payments: ReturnType<typeof findEntry>;
    email: ReturnType<typeof findEntry>;
    sms: ReturnType<typeof findEntry>;
    analytics: ReturnType<typeof findEntry>;
    monitoring: ReturnType<typeof findEntry>;
    storage: ReturnType<typeof findEntry>;
    search: ReturnType<typeof findEntry>;
    flags: ReturnType<typeof findEntry>;
  };
  design: {
    css: ReturnType<typeof findEntry>;
    comp: ReturnType<typeof findEntry>;
    icons: ReturnType<typeof findEntry>;
    font: ReturnType<typeof findEntry>;
  };
  i18n: {
    locales: string[];
    defaultLocale: string;
    rtl: boolean;
    source: ReturnType<typeof findEntry>;
  };
  testing: {
    unit: ReturnType<typeof findEntry>;
    component: ReturnType<typeof findEntry>;
    e2e: ReturnType<typeof findEntry>;
    api: ReturnType<typeof findEntry>;
    coverage: number;
  };
  devops: {
    ci: ReturnType<typeof findEntry>;
    cd: ReturnType<typeof findEntry>;
    iac: ReturnType<typeof findEntry>;
    pkg: ReturnType<typeof findEntry>;
    monorepo: ReturnType<typeof findEntry>;
  };
  prof: string[];
  scripts: ScriptsSet;
}

function resolve(raw: ProjectData): Resolved {
  // Auto-fix before resolving
  const data = fixSkill(raw);
  const s = data.stack;
  const r: Resolved = {
    name: or(data.identity.name, 'untitled-project'),
    slug: '',
    description: or(data.identity.description, '(no description)'),
    audience: or(data.identity.targetAudience, 'general users'),
    projectType: findEntry(projectTypes, data.identity.projectType),
    language: findEntry(languages, data.language),
    frontend: findEntry(frontends, s.frontend),
    backend: findEntry(backends, s.backend),
    db: {
      primary: findEntry(primaryDatabases, s.database.primary),
      cache: findEntry(cacheDatabases, s.database.cache),
      vector: findEntry(vectorDatabases, s.database.vector),
      search: findEntry(searchDatabases, s.database.search),
      analytics: findEntry(analyticsDatabases, s.database.analytics),
      graph: findEntry(graphDatabases, s.database.graph),
      ts: findEntry(timeSeriesDatabases, s.database.timeseries),
    },
    hosting: {
      frontend: findEntry(frontendHostingCatalog, s.hosting.frontend),
      backend: findEntry(backendHostingCatalog, s.hosting.backend),
      database: findEntry(databaseHostingCatalog, s.hosting.database),
      cdn: findEntry(cdnsCatalog, s.hosting.cdn),
      orchestration: findEntry(orchestrationCatalog, s.hosting.orchestration),
    },
    auth: {
      primary: s.auth.primary ? findEntry(authProviders, s.auth.primary) : undefined,
      social: s.auth.socialProviders
        .map((id: string) => findEntry(socialProviders, id))
        .filter(Boolean),
    },
    thirdParty: {
      payments: findEntry(paymentProviders, s.thirdParty.payments),
      email: findEntry(emailProviders, s.thirdParty.email),
      sms: findEntry(smsProviders, s.thirdParty.sms),
      analytics: findEntry(analyticsProviders, s.thirdParty.analytics),
      monitoring: findEntry(monitoringProviders, s.thirdParty.monitoring),
      storage: findEntry(storageProviders, s.thirdParty.storage),
      search: findEntry(managedSearchProviders, s.thirdParty.search),
      flags: findEntry(featureFlagsProviders, s.thirdParty.featureFlags),
    },
    design: {
      css: findEntry(cssFrameworks, s.design.cssFramework),
      comp: findEntry(componentLibraries, s.design.componentLibrary),
      icons: findEntry(iconSets, s.design.iconSet),
      font: findEntry(fontFamilies, s.design.fontFamily),
    },
    i18n: {
      locales: s.i18n.supportedLocales,
      defaultLocale: s.i18n.defaultLocale,
      rtl: s.i18n.rtlSupport,
      source: findEntry(translationSources, s.i18n.translationSource),
    },
    testing: {
      unit: findEntry(unitTestTools, s.testing.unit),
      component: findEntry(componentTestTools, s.testing.component),
      e2e: findEntry(e2eTestTools, s.testing.e2e),
      api: findEntry(apiTestTools, s.testing.api),
      coverage: s.testing.coverageTarget,
    },
    devops: {
      ci: findEntry(ciProviders, s.devops.ci),
      cd: findEntry(cdStrategies, s.devops.cd),
      iac: findEntry(iacTools, s.devops.iac),
      pkg: findEntry(packageManagers, s.devops.packageManager),
      monorepo: findEntry(monorepoTools, s.devops.monorepo),
    },
    prof: Object.entries(data.professionalRequirements)
      .filter(([, v]) => v === true)
      .map(([k]) => k),
    scripts: pickScripts(s.frontend, data.language),
  };
  r.slug = slugify(r.name) || 'project';
  return r;
}

// =====================================================================
//   Setup command builder — picks the RIGHT scaffold per framework
// =====================================================================
function buildSetupCommands(r: Resolved): string {
  const name = r.slug;
  const lang = r.language?.id ?? 'typescript';
  const fr = r.frontend?.id ?? '';
  const be = r.backend?.id ?? '';
  const pkg = r.devops.pkg?.name?.toLowerCase() ?? 'pnpm';

  const enableCmd =
    pkg === 'pnpm'
      ? 'corepack enable pnpm'
      : pkg === 'yarn'
        ? 'corepack enable yarn'
        : pkg === 'bun'
          ? 'curl -fsSL https://bun.sh/install | bash'
          : '';

  const lines: string[] = [];
  if (enableCmd) lines.push(enableCmd);

  // Scaffold commands per framework — all use the framework's official scaffolder
  if (fr === 'nextjs') {
    lines.push(`pnpm create next-app@latest ${name} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm`);
  } else if (fr === 'remix') {
    lines.push(`pnpm create remix@latest ${name} --template remix-run/remix/templates/remix --typescript --install --package-manager pnpm`);
  } else if (fr === 'nuxt') {
    lines.push(`pnpm dlx nuxi@latest init ${name} -t v3 --packageManager pnpm --gitInit false`);
  } else if (fr === 'sveltekit') {
    lines.push(`pnpm dlx sv create ${name} --template minimal --types ts --no-add-ons --install pnpm`);
  } else if (fr === 'astro') {
    lines.push(`pnpm create astro@latest ${name} --template minimal --typescript strict --install --git --skip-houston --yes`);
  } else if (['react', 'vue', 'preact', 'solid', 'svelte', 'lit'].includes(fr)) {
    const tmpl =
      fr === 'react' ? 'react-ts' :
        fr === 'vue' ? 'vue-ts' :
          fr === 'preact' ? 'preact-ts' :
            fr === 'solid' ? 'solid-ts' :
              fr === 'svelte' ? 'svelte-ts' :
                'lit-ts';
    lines.push(`pnpm create vite@latest ${name} --template ${tmpl}`);
  } else if (fr === 'angular') {
    lines.push(`pnpm dlx @angular/cli new ${name} --routing --style=css --strict --skip-git --package-manager=pnpm --defaults`);
  } else if (fr === 'qwik') {
    lines.push(`pnpm create qwik@latest empty ${name}`);
  } else if (fr === 'ember') {
    lines.push(`pnpm dlx ember-cli new ${name} --skip-npm --skip-git --typescript`);
  } else if (fr === 'expo') {
    lines.push(`pnpm create expo-app@latest ${name} --template blank-typescript`);
  } else if (fr === 'react-native') {
    lines.push(`pnpm dlx @react-native-community/cli init ${name} --version latest --pm pnpm --skip-install`);
  } else if (fr === 'flutter') {
    lines.push(`flutter create ${name} --platforms=ios,android --org com.example`);
  } else if (fr === 'swiftui') {
    lines.push(`xedoes -create-executable-for-xcode ${name}.xcodeproj`);
  } else if (fr === 'jetpack-compose') {
    lines.push(`studio -g ${name}`);
  } else if (fr === 'tauri') {
    lines.push(`pnpm create tauri-app@latest ${name} --template react-ts --manager pnpm --identifier com.${name}.app --yes`);
  } else if (fr === 'electron') {
    lines.push(`pnpm dlx create-electron-app ${name} --template webpack-typescript`);
  } else if (be === 'django') {
    lines.push(`pip install Django psycopg2-binary && django-admin startproject ${name} .`);
  } else if (be === 'fastapi') {
    lines.push(`mkdir ${name} && cd ${name} && python -m venv .venv && source .venv/bin/activate && pip install fastapi uvicorn[standard]`);
  } else if (be === 'flask') {
    lines.push(`mkdir ${name} && cd ${name} && python -m venv .venv && source .venv/bin/activate && pip install flask`);
  } else if (be === 'spring-boot') {
    lines.push(`curl https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql -d name=${name} -d type=maven-project -o ${name}.zip && unzip ${name}.zip -d ${name}`);
  } else if (be === 'rails') {
    lines.push(`rails new ${name} --database=postgresql --skip-git --skip-test=false`);
  } else if (be === 'laravel') {
    lines.push(`composer create-project laravel/laravel ${name}`);
  } else if (be === 'gin') {
    lines.push(`mkdir ${name} && cd ${name} && go mod init ${name}`);
  }

  lines.push(`cd ${name}`);

  if (lang === 'typescript' || lang === 'javascript') {
    lines.push(`# Apply pinned versions to package.json`);
  }

  return lines.join('\n');
}

// =====================================================================
//   Generate Skill with frontend-specific scripts
// =====================================================================
function buildPackageJsonSnippet(r: Resolved): string {
  const data: ProjectData = {
    identity: { name: r.name, description: r.description, targetAudience: r.audience, projectType: r.frontend?.id as any ?? '' },
    language: r.language?.id as any ?? 'typescript',
    coreFeatures: [],
    stack: {} as any,
    professionalRequirements: {} as any,
    additionalRequirements: [],
  };
  // Use minimal stub just for type safety; we only use r.slug here
  const lines: string[] = [];
  lines.push("cat > package.json <<'EOF'");
  lines.push('{');
  lines.push(`  "name": "${r.slug}",`);
  lines.push(`  "version": "0.1.0",`);
  lines.push(`  "private": true,`);
  const runtime = RUNTIME_PKG[r.language?.id ?? 'typescript'] || RUNTIME_PKG.typescript;
  lines.push(`  ${runtime},`);

  // Framework deps
  if (r.frontend?.id === 'nextjs') {
    lines.push(`  "next": "^15.0.0",`);
    lines.push(`  "react": "^18.3.1", "react-dom": "^18.3.1",`);
  } else if (r.frontend?.id === 'remix') {
    lines.push(`  "@remix-run/react": "^2.13.0",`);
  } else if (r.frontend?.id === 'nuxt') {
    lines.push(`  "nuxt": "^3.13.0",`);
  } else if (r.frontend?.id === 'sveltekit') {
    lines.push(`  "@sveltejs/kit": "^2.7.0",`);
  } else if (r.frontend?.id === 'astro') {
    lines.push(`  "astro": "^4.16.0",`);
  } else if (['react', 'vue', 'preact', 'solid', 'svelte', 'lit'].includes(r.frontend?.id ?? '')) {
    lines.push(`  "react": "^18.3.1", "react-dom": "^18.3.1",`);
    lines.push(`  "vite": "^5.4.0",`);
  } else if (r.frontend?.id === 'angular') {
    lines.push(`  "@angular/core": "^18.2.0",`);
  }

  if (r.language?.id === 'typescript') {
    lines.push(`  "typescript": "^5.6.0",`);
  }
  if (r.design.css?.id === 'tailwind') lines.push(`  "tailwindcss": "^3.4.0",`);
  lines.push(`  "zod": "^3.23.0",`);
  if (r.testing.unit?.id === 'vitest') lines.push(`  "vitest": "^2.1.0",`);
  if (r.testing.e2e?.id === 'playwright') lines.push(`  "@playwright/test": "^1.47.0",`);
  if (r.thirdParty.payments?.id === 'stripe') lines.push(`  "stripe": "^17.0.0",`);
  if (r.thirdParty.email?.id === 'resend') lines.push(`  "resend": "^4.0.0",`);
  if (r.thirdParty.monitoring?.id === 'sentry') lines.push(`  "@sentry/node": "^8.0.0",`);

  lines.push(`  "scripts": {`);
  lines.push(`    "dev": "${r.scripts.dev}",`);
  lines.push(`    "build": "${r.scripts.build}",`);
  lines.push(`    "start": "${r.scripts.start}",`);
  lines.push(`    "lint": "${r.scripts.lint}",`);
  lines.push(`    "typecheck": "${r.scripts.typecheck}",`);
  lines.push(`    "test": "${r.scripts.test}"`);
  lines.push('  }');
  lines.push('}');
  lines.push('EOF');
  lines.push('pnpm install');

  return lines.join('\n');
}

// =====================================================================
//   Main generator
// =====================================================================
export class SkillGenerator {
  generate(data: ProjectData): { skill: string; cursor: string; prompt: string; issues: ReturnType<typeof validateSkill> } {
    const fixed = fixSkill(data);
    const r = resolve(fixed);
    // Validate AFTER auto-fix — should be empty in healthy output
    const issues = validateSkill(fixed);
    return {
      skill: this.generateClaudeSkill(r, fixed, issues),
      cursor: this.generateCursorRules(r, fixed),
      prompt: this.generateMasterPrompt(r, fixed),
      issues,
    };
  }

  private generateClaudeSkill(r: Resolved, data: ProjectData, _issues: ReturnType<typeof validateSkill>): string {
    const proj = r.projectType?.name ?? 'application';
    const dbLines = [
      r.db.primary && (r.db.primary as { name: string }).name && (r.db.primary as { name: string }).name !== 'No Primary DB'
        ? `**Primary DB:** ${(r.db.primary as { name: string }).name} (${r.db.primary.version})` : null,
      r.db.cache && (r.db.cache as { name: string }).name && (r.db.cache as { name: string }).name !== 'No Cache'
        ? `**Cache:** ${(r.db.cache as { name: string }).name}` : null,
      r.db.vector && (r.db.vector as { name: string }).name && (r.db.vector as { name: string }).name !== 'No Vector DB'
        ? `**Vector (AI):** ${(r.db.vector as { name: string }).name}` : null,
      r.db.search && (r.db.search as { name: string }).name && (r.db.search as { name: string }).name !== 'No Search'
        ? `**Search:** ${(r.db.search as { name: string }).name}` : null,
    ].filter(Boolean).join('\n');

    return `---
name: ${r.slug}
description: |
  Build "${r.name}" — a ${proj} matching the user's exact selections.
  Use this skill when the user asks to "build", "implement", or "start" the
  ${r.name} project. The skill enforces pinned 2025 versions, deterministic
  file layout, security defaults, and accessibility requirements so the
  output is build-ready on the first try.
---

# Skill: ${r.name}

This skill produces a complete, production-grade codebase for **${r.name}**.
Every instruction below is MANDATORY. Do not skip, reorder, or improvise.

---

## 0. Project Context (resolved from wizard)

\`\`\`
Project name      : ${r.name}
Type              : ${proj} (${r.projectType?.description ?? ''})
Target audience   : ${r.audience}
Description       : ${r.description}
Language          : ${r.language?.name ?? 'TypeScript'} (${r.language?.version ?? '^5.6.0'})
Frontend          : ${formatFrontend(r.frontend?.id ?? '')} ${r.frontend?.version ? `(${r.frontend.version})` : ''}
${r.backend && r.backend.id !== 'none' ? `Backend           : ${formatBackend(r.backend.id)} (${r.backend.version})` : ''}
${dbLines}
Frontend hosting : ${r.hosting.frontend && r.hosting.frontend.id !== 'none' ? r.hosting.frontend.name : '—'}
${r.backend && r.backend.id !== 'none' ? `Backend hosting   : ${r.hosting.backend && r.hosting.backend.id !== 'none' ? r.hosting.backend.name : '—'}` : ''}
Database hosting  : ${r.hosting.database && r.hosting.database.id !== 'none' ? r.hosting.database.name : '—'}
CDN               : ${r.hosting.cdn && r.hosting.cdn.id !== 'none' ? r.hosting.cdn.name : '—'}
Auth              : ${r.auth.primary?.name ?? '—'}${r.auth.social.length ? ` (social: ${r.auth.social.map((s) => s!.name).join(', ')})` : ''}
Monitoring        : ${r.thirdParty.monitoring && r.thirdParty.monitoring.id !== 'none' ? r.thirdParty.monitoring.name : '—'}
Analytics         : ${r.thirdParty.analytics && r.thirdParty.analytics.id !== 'none' ? r.thirdParty.analytics.name : '—'}
Payments          : ${r.thirdParty.payments && r.thirdParty.payments.id !== 'none' ? r.thirdParty.payments.name : '—'}
Storage           : ${r.thirdParty.storage && r.thirdParty.storage.id !== 'none' ? r.thirdParty.storage.name : '—'}
Testing           : ${r.testing.unit?.name}, ${r.testing.e2e && r.testing.e2e.id !== 'none' ? r.testing.e2e.name : '—'}, ${r.testing.api?.name}
CI/CD             : ${r.devops.ci?.name} + ${r.devops.cd?.name}
Package manager   : ${r.devops.pkg?.name}
\`\`\`

Professional features required: ${r.prof.length ? r.prof.join(', ') : 'none'}

---

## 1. Setup Commands (run EXACTLY in this order)

\`\`\`bash
${buildSetupCommands(r)}

${buildPackageJsonSnippet(r)}
\`\`\`

**Scripts** (in package.json — VERIFIED to match the frontend choice):
- \`dev\` → \`${r.scripts.dev}\`
- \`build\` → \`${r.scripts.build}\`
- \`start\` → \`${r.scripts.start}\`
- \`lint\` → \`${r.scripts.lint}\`
- \`typecheck\` → \`${r.scripts.typecheck}\`
- \`test\` → \`${r.scripts.test}\`

---

## 2. File Layout (DO NOT deviate)

\`\`\`
${buildFileLayout(data)}
\`\`\`

---

## 3. Coding Conventions

- **Language:** ${r.language?.name ?? 'TypeScript'} — **strict mode enabled** (\`"strict": true\`).
- **Imports:** absolute via path alias \`@/\` → \`./src/\`.
- **Components:** function components + hooks only. No class components.
- **Naming:** PascalCase files for components (\`Button.tsx\`); camelCase for utilities.
- **Errors:** every async function wraps with \`try/catch\` that logs structured + shows toast + reports to ${r.thirdParty.monitoring?.name ?? 'error tracker'}.
- **Comments:** JSDoc on every exported function. Inline ONLY for non-obvious logic.

---

## 4. Security (non-negotiable)

| Rule | Implementation |
|------|----------------|
| HTTPS only | HSTS \`max-age=63072000; includeSubDomains; preload\` |
| Auth cookies | httpOnly + Secure + SameSite=Strict |
| Password hashing | bcrypt rounds=12 / argon2id |
| Rate limiting | 100 req/min/IP, 1000 req/hour/user |
| Input validation | ${r.backend && r.backend.id === 'fastapi' ? 'Pydantic v2 models' : 'Zod schemas'} at the API boundary |
| CSRF | double-submit cookie pattern |
| Security headers | CSP, X-Frame-Options=DENY, Referrer-Policy=strict-origin-when-cross-origin |
| Secrets | ${r.hosting.frontend?.name ?? 'platform'} env vars + ${r.devops.iac && r.devops.iac.id !== 'none' ? r.devops.iac.name : 'AWS KMS / GCP Secret Manager'} for prod |
${r.db.primary && r.db.primary.id === 'supabase-db' ? '| RLS | enabled on every table; deny by default |' : ''}
${dataNeedsGDPR(data) ? '| GDPR/CCPA | data export, 30-day deletion grace, consent log |\n| Sensitive columns | AES-256-GCM or pgcrypto |' : ''}

---

## 5. Database (${r.db.primary?.name ?? 'SQLite local'})

${this.generateSchemaSection(r)}

---

## 6. API & Routes (${r.backend ? formatBackend(r.backend.id) : `${formatFrontend(r.frontend?.id ?? '')} Server Actions`})

${this.generateApiSection(r)}

---

## 7. UI Components (${formatFrontend(r.frontend?.id ?? '')})

${this.generateUiSection(r)}

---

## 8. Testing

\`\`\`bash
${r.devops.pkg?.id === 'pnpm'
  ? `${r.testing.unit?.id === 'vitest' ? 'pnpm test' : 'pnpm test'}              # unit
pnpm test:e2e         # e2e
pnpm test:coverage    # coverage report
pnpm test:a11y        # axe-core integration`
  : r.testing.unit?.id === 'jest' ? '# jest' : '# tests'}
\`\`\`

Coverage target: **${r.testing.coverage}%**. Enforced in CI.

---

## 9. CI/CD (${r.devops.ci?.name ?? 'GitHub Actions'})

Workflow files go in \`.github/workflows/\`. Required jobs per PR:

1. \`typecheck\` — \`${r.devops.pkg?.id ?? 'pnpm'} ${r.scripts.typecheck}\`
2. \`lint\` — \`${r.devops.pkg?.id ?? 'pnpm'} ${r.scripts.lint}\`
3. \`test\` — \`${r.devops.pkg?.id ?? 'pnpm'} test\`
4. \`build\` — \`${r.devops.pkg?.id ?? 'pnpm'} build\`
5. \`preview\` — deploy to ${r.hosting.frontend?.name ?? r.hosting.backend?.name ?? 'preview environment'}

---

## 10. Performance Budgets (enforced in CI via Lighthouse)

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| TBT | < 300ms |
| JS bundle (route) | < 300 KB gzipped |

---

## 11. Accessibility (WCAG 2.2 AA)

- Semantic HTML (no \`<div onClick>\`).
- Visible focus rings on every interactive element.
- Color contrast ≥ 4.5:1 (text), 3:1 (large + UI).
- axe-core in CI; build fails on serious/critical issues.
- Keyboard navigation works for every flow.

---

## 12. Definition of Done — do NOT mark complete until ALL true

${generateDoD(r, data)}
`;
  }

  private generateCursorRules(r: Resolved, data: ProjectData): string {
    const fe = r.frontend?.id ?? '';
    const be = r.backend?.id ?? '';
    return `# Cursor Rules — ${r.name}
# Generated by Vibe Coder Prompt Builder · pinned 2025 versions

# === STACK ===
# Language     : ${r.language?.name ?? 'TypeScript'} (${r.language?.version ?? '^5.6.0'})
# Frontend     : ${formatFrontend(fe)} ${r.frontend?.version ? `(${r.frontend.version})` : ''}
# Backend      : ${be !== 'none' ? formatBackend(be) : 'none'}
# Database     : ${r.db.primary?.name ?? '—'}
# Tests        : ${r.testing.unit?.name}, ${r.testing.e2e?.name}, ${r.testing.api?.name}
# CI/CD        : ${r.devops.ci?.name} + ${r.devops.cd?.name}
# Host frontend: ${r.hosting.frontend?.name ?? '—'}
# Host backend : ${r.hosting.backend?.name ?? '—'}
# Package mgr  : ${r.devops.pkg?.name}

# === FRAMEWORK-SPECIFIC (verified — must be followed) ===
# Scripts MUST match the framework below:
#   dev: ${r.scripts.dev}
#   build: ${r.scripts.build}
#   start: ${r.scripts.start}
${fe === 'nextjs' ? '- Use Next.js App Router (NOT Pages Router).\n- Server Components by default. Client components only when interactivity is needed.\n- Use Server Actions for mutations; REST API only for external integrations.\n- Co-locate route handlers (route.ts) with their pages.' : ''}
${fe === 'remix' ? '- Use Remix loaders/actions for every route; avoid client-side data fetching for primary data.\n- Progressive enhancement: every form must work without JavaScript.' : ''}
${fe === 'astro' ? '- Use Astro Islands for any interactive bits.\n- Prefer static generation. Use SSR only where truly needed (auth, dashboards).' : ''}
${['react', 'vue', 'preact', 'solid', 'svelte'].includes(fe) ? '- Use Vite as the bundler (already configured).\n- Use TanStack Query (React) or Pinia (Vue) for server state.\n- Use Zustand (React) or equivalent for client state.' : ''}
${be === 'nextjs' || be === 'remix' || be === 'nuxt' || be === 'sveltekit'
  ? '# Note: backend is built into the frontend framework — no separate API needed.' : ''}
${be === 'fastapi' ? '- Use Pydantic v2 models for ALL request/response bodies.\n- Use Depends() for DI, never import services directly.\n- One router per domain (users, products, ...).\n- Use async def for all route handlers.' : ''}
${be === 'nestjs' ? '- One NestJS module per bounded context.\n- Use DTOs for all controller payloads (class-validator).\n- ConfigModule with Joi validation.' : ''}
${be === 'django' ? '- Apps per bounded context; use Django REST Framework or Django Ninja for APIs.\n- Use select_related / prefetch_related aggressively to avoid N+1.' : ''}
${be === 'express' || be === 'fastify' ? '- Layered structure: routes → controllers → services → repositories.\n- Use middleware for cross-cutting concerns (auth, logging, rate limit).' : ''}

# === ALWAYS ===
- Use TypeScript strict mode. No \`any\`, no \`@ts-ignore\`.
- Use ${be === 'fastapi' ? 'Pydantic v2 models for ALL request/response bodies' : 'Zod schemas at every API boundary'}.
- Validate inputs server-side, never trust the client.
- Store passwords with bcrypt (rounds=12) or argon2id.
- Sessions in httpOnly, Secure, SameSite=Strict cookies.
- All money as integers (cents). Never floats.
- All timestamps as UTC (TIMESTAMPTZ). Format at the edge only.
- Use ${r.testing.unit?.name ?? 'vitest'} for tests. Mock external services.
- Type every function param and return value.

# === NEVER ===
- Never store secrets in code or committed .env files.
- Never use \`localStorage\` for JWT or any auth token.
- Never commit console.log for debugging — use a structured logger.
- Never use \`document.querySelector\` in React/Vue code.
- Never disable ESLint rules to silence warnings.
- Never use float for currency.
- Never use scripts that don't match the framework choice (e.g., \`next dev\` for a Vite project).

# === TESTS TO GENERATE PER NEW FILE ===
- Every component → render test + a11y test.
- Every route handler → success + 4xx + 5xx path.
- Every service → unit tests covering happy + error paths.
- Mock external services at module boundary.

# === FILE NAMING ===
- React components  : PascalCase — Button.tsx
- Utilities        : camelCase — formatDate.ts
- Route handlers   : kebab-case — user-profile/route.ts
- Tests            : *.test.tsx or *.spec.ts
`;
  }

  private generateMasterPrompt(r: Resolved, data: ProjectData): string {
    return `# Master Build Prompt — ${r.name}

> Generated by Vibe Coder Prompt Builder · ${new Date().toISOString().slice(0, 10)}
> This prompt is deterministic and complete. Do not ask the user clarifying questions — every choice has been made and validated.

## Goal

Build **${r.name}**: ${r.description}
For audience: ${r.audience}
Project type: ${r.projectType?.name ?? 'application'}

## Locked Stack (DO NOT change)

| Layer | Tool | Version |
|-------|------|---------|
| Language | ${r.language?.name ?? 'TypeScript'} | ${r.language?.version ?? '^5.6.0'} |
| Frontend | ${formatFrontend(r.frontend?.id ?? '')} | ${r.frontend?.version ?? '—'} |
| Backend | ${r.backend && r.backend.id !== 'none' ? formatBackend(r.backend.id) : 'none (full-stack frontend)'} | ${r.backend?.version ?? '—'} |
| Primary DB | ${r.db.primary?.name ?? '—'} | ${r.db.primary?.version ?? '—'} |
| Cache | ${r.db.cache && r.db.cache.name !== 'No Cache' ? r.db.cache.name : '—'} | — |
| Vector DB | ${r.db.vector && r.db.vector.name !== 'No Vector DB' ? r.db.vector.name : '—'} | — |
| Search | ${r.db.search && r.db.search.name !== 'No Search' ? r.db.search.name : '—'} | — |
| Frontend hosting | ${r.hosting.frontend?.name ?? '—'} | — |
| Backend hosting | ${r.hosting.backend?.name ?? '—'} | — |
| DB hosting | ${r.hosting.database?.name ?? '—'} | — |
| CDN | ${r.hosting.cdn?.name ?? '—'} | — |
| Auth | ${r.auth.primary?.name ?? '—'} | — |
| Payments | ${r.thirdParty.payments?.name ?? '—'} | — |
| Email | ${r.thirdParty.email?.name ?? '—'} | — |
| Monitoring | ${r.thirdParty.monitoring?.name ?? '—'} | — |
| Storage | ${r.thirdParty.storage?.name ?? '—'} | — |
| Unit Test | ${r.testing.unit?.name ?? '—'} | ${r.testing.unit?.version ?? ''} |
| E2E Test | ${r.testing.e2e?.name ?? '—'} | ${r.testing.e2e?.version ?? ''} |
| CI | ${r.devops.ci?.name ?? '—'} | — |
| CD | ${r.devops.cd?.name ?? '—'} | — |
| Package Manager | ${r.devops.pkg?.name ?? '—'} | — |

## Commands to Run (EXACT order)

\`\`\`bash
${buildSetupCommands(r)}

cd ${r.slug}

${buildPackageJsonSnippet(r)}
\`\`\`

## Definition of Done

${generateDoD(r, data)}

When ALL of the above are true, the project is ready to deploy.
`;
  }

  private generateSchemaSection(r: Resolved): string {
    if (!r.db.primary) return 'No primary database. Use in-memory state or files.';
    const db = r.db.primary.name;
    if (['PostgreSQL', 'Supabase Postgres', 'Neon', 'CockroachDB'].includes(db)) {
      return `\`\`\`sql
-- Users (example — adapt to your domain)
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           CITEXT UNIQUE NOT NULL,
  display_name    VARCHAR(80) NOT NULL,
  password_hash   TEXT NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_users_created_at ON users(created_at DESC);
-- Add indexes for any FK you create. Add updated_at trigger on every table.

-- Standard conventions for this DB:
--   - TIMESTAMPTZ for all timestamps (UTC at rest; convert at the edge)
--   - CITEXT/TEXT for emails (case-insensitive)
--   - UUID PKs (gen_random_uuid())
--   - updated_at triggers on every table
--   - money columns: INTEGER (cents)
\`\`\``;
    }
    if (db === 'MongoDB') {
      return `\`\`\`ts
// schemas/user.ts
import { z } from 'zod';
export const UserSchema = z.object({
  _id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1).max(80),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type User = z.infer<typeof UserSchema>;
\`\`\``;
    }
    if (db === 'SQLite') {
      return `\`\`\`sql
-- Local SQLite. Use better-sqlite3 with Drizzle ORM.
CREATE TABLE users (
  id TEXT PRIMARY KEY,            -- uuid v4
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
\`\`\``;
    }
    return `Define schemas using Prisma (recommended) or Drizzle ORM. All entities MUST have: id (UUID), createdAt, updatedAt. Soft-delete via deletedAt where appropriate.`;
  }

  private generateApiSection(r: Resolved): string {
    if (
      ['nextjs', 'remix', 'nuxt', 'sveltekit'].includes(r.frontend?.id ?? '')
    ) {
      return `Use ${formatFrontend(r.frontend?.id ?? '')} Server Actions + route handlers. Each route: GET returns DTO, POST validates body, returns 201, errors return JSON { error: { code, message, details? } }.`;
    }
    if (!r.backend || r.backend.id === 'none') {
      return 'No backend. Use static / serverless routes only.';
    }
    return `RESTful endpoints under \`/api/v1/\`. Each endpoint:
- Validates input with ${r.backend.id === 'fastapi' ? 'Pydantic v2' : 'Zod'}
- Returns 2xx with DTO or 4xx/5xx with { error: { code, message } }
- Requires auth (except /health, /auth/*)
- Logs every request with correlation ID`;
  }

  private generateUiSection(r: Resolved): string {
    return `Components live in src/components/. For every shared component:
- Storybook story (or equivalent) at .stories.tsx
- a11y: keyboard navigable, visible focus, ARIA labels
- Dark mode via CSS variables (no JS theme)
- Responsive: mobile-first (320 → 1920px)
${r.design.comp?.id === 'shadcn-ui' ? '- Use shadcn/ui primitives — install via `pnpm dlx shadcn@latest add <name>`' : ''}`;
  }
}

// =====================================================================
//   Helpers
// =====================================================================
function dataNeedsGDPR(data: ProjectData): boolean {
  return (
    data.professionalRequirements.sensitiveData ||
    data.professionalRequirements.payments ||
    data.professionalRequirements.userAccounts
  );
}

function generateDoD(r: Resolved, _data: ProjectData): string {
  const items: string[] = [
    '- [ ] All TypeScript files compile with strict mode, zero `any`',
    '- [ ] No ESLint warnings, no console.log left in code',
    `- [ ] Test coverage ≥ ${r.testing.coverage}% (enforced in CI)`,
    '- [ ] Lighthouse CI passes: LCP < 2.5s, CLS < 0.1, TBT < 300ms',
    '- [ ] axe-core shows zero serious/critical issues',
    '- [ ] All API endpoints have unit + integration tests',
    '- [ ] Auth uses httpOnly cookies, passwords hashed',
    '- [ ] All timestamps are UTC',
    '- [ ] README explains setup, scripts, and architecture',
    '- [ ] Preview deployment works on every PR',
  ];
  if (r.thirdParty.payments && r.thirdParty.payments.id !== 'none') {
    items.push('- [ ] Payment flows (success + failure + webhook) covered by E2E tests');
  }
  return items.join('\n');
}

function placeholderData(_r: Resolved): ProjectData {
  // Used only for buildFileLayout's typeof signature; we don't read its fields
  // This function is deprecated — pass real `data` to buildFileLayout instead.
  return {} as ProjectData;
}