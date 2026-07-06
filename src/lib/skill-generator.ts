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
  const isPythonStack = s.backend && ['django', 'fastapi', 'flask'].includes(s.backend as string);
  const hasFrontend = !isMobileFirst && s.frontend && s.frontend !== 'none';

  if (hasBackend && !['nextjs', 'remix', 'nuxt', 'sveltekit'].includes(s.frontend) && !isMobileFirst) {
    if (isPythonStack) {
      topDirs.push(`├── ${s.backend}/            # ${formatBackend(s.backend)} project root`);
      topDirs.push(`│   ├── ${s.backend}/        # settings (settings.py, urls.py, wsgi.py)`);
      topDirs.push(`│   ├── apps/                # Django apps (models, views, serializers)`);
      topDirs.push(`│   │   ├── core/           # shared models, base classes`);
      topDirs.push(`│   │   └── api/            # DRF views, serializers, urls`);
      topDirs.push(`│   ├── manage.py`);
      topDirs.push(`│   ├── requirements.txt`);
      topDirs.push(`│   ├── pyproject.toml`);
      topDirs.push(`│   └── tests/              # pytest suites`);
    } else {
      topDirs.push(`├── server/                # ${formatBackend(s.backend)} API`);
    }
  }
  if (isMobileFirst) {
    topDirs.push(`├── mobile/                # ${formatFrontend(s.frontend)} mobile`);
  }
  if (hasFrontend) {
    if (isPythonStack) {
      // Python "frontend" = templates / static served by Django
      topDirs.push(`├── templates/             # Django/Jinja2 HTML templates`);
      topDirs.push(`│   ├── base.html`);
      topDirs.push(`│   └── partials/`);
      topDirs.push(`├── static/                # CSS / JS / images`);
      topDirs.push(`│   ├── css/`);
      topDirs.push(`│   └── js/`);
    } else {
      topDirs.push(`├── src/                   # ${formatFrontend(s.frontend)} frontend`);
      topDirs.push(`│   ├── components/`);
      topDirs.push(`│   ├── pages/  (or routes/)`);
      topDirs.push(`│   ├── lib/`);
      topDirs.push(`│   ├── styles/`);
      topDirs.push(`│   └── types/`);
    }
  } else if (!isMobileFirst) {
    topDirs.push(`├── (no separate frontend directory — backend serves everything)`);
  }
  topDirs.push(`├── tests/                  # e2e + integration`);
  if (hasFrontend) {
    topDirs.push(`├── public/                 # static assets`);
  }
  topDirs.push(`├── .github/workflows/      # CI/CD`);
  topDirs.push(`├── .env.example`);
  const langId = (s as any).language as string | undefined;
  if (isPythonStack) {
    topDirs.push(`├── pyproject.toml`);
    topDirs.push(`├── requirements.txt`);
  } else if (langId === 'go') {
    topDirs.push(`└── go.mod`);
  } else if (langId === 'rust') {
    topDirs.push(`└── Cargo.toml`);
  } else {
    topDirs.push(`├── package.json`);
    topDirs.push(`├── tsconfig.json`);
  }
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
    test: 'test',
  };
  // Node/JS/TS projects use npm-style scripts
  if (['typescript', 'javascript'].includes(language)) {
    return {
      dev: SCRIPTS_BY_FRONTEND[frontend]?.dev || 'vite',
      build: SCRIPTS_BY_FRONTEND[frontend]?.build || 'vite build',
      start: SCRIPTS_BY_FRONTEND[frontend]?.start || 'vite preview',
      lint: SCRIPTS_BY_FRONTEND[frontend]?.lint || 'eslint .',
      typecheck: 'tsc --noEmit',
      // Test runner is overridden by resolve() based on user's testing.unit choice
      test: 'test',
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

  const fullstackFrameworks = ['nextjs', 'remix', 'nuxt', 'sveltekit', 'astro'];
  const isFullstack = fr && fullstackFrameworks.includes(fr);
  const isMonorepo = fr && fr !== 'none' && be && be !== 'none' && !isFullstack;

  if (isMonorepo) {
    lines.push(`mkdir ${name}`);
    lines.push(`cd ${name}`);
    if (pkg === 'pnpm') {
      lines.push(`pnpm init`);
      lines.push(`echo -e "packages:\\n  - 'apps/*'\\n  - 'packages/*'" > pnpm-workspace.yaml`);
    } else {
      lines.push(`npm init -y`);
    }
    lines.push(`mkdir apps`);
    lines.push(`cd apps`);
  }

  const scaffoldFrontend = (folderName: string) => {
    if (fr === 'nextjs') return `pnpm create next-app@latest ${folderName} --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm`;
    if (fr === 'remix') return `pnpm create remix@latest ${folderName} --template remix-run/remix/templates/remix --typescript --install --package-manager pnpm`;
    if (fr === 'nuxt') return `pnpm dlx nuxi@latest init ${folderName} -t v3 --packageManager pnpm --gitInit false`;
    if (fr === 'sveltekit') return `pnpm dlx sv create ${folderName} --template minimal --types ts --no-add-ons --install pnpm`;
    if (fr === 'astro') return `pnpm create astro@latest ${folderName} --template minimal --typescript strict --install --git --skip-houston --yes`;
    if (['react', 'vue', 'preact', 'solid', 'svelte', 'lit'].includes(fr)) {
      const tmpl = fr === 'react' ? 'react-ts' : fr === 'vue' ? 'vue-ts' : fr === 'preact' ? 'preact-ts' : fr === 'solid' ? 'solid-ts' : fr === 'svelte' ? 'svelte-ts' : 'lit-ts';
      return `pnpm create vite@latest ${folderName} --template ${tmpl}`;
    }
    if (fr === 'angular') return `pnpm dlx @angular/cli new ${folderName} --routing --style=css --strict --skip-git --package-manager=pnpm --defaults`;
    if (fr === 'qwik') return `pnpm create qwik@latest empty ${folderName}`;
    if (fr === 'ember') return `pnpm dlx ember-cli new ${folderName} --skip-npm --skip-git --typescript`;
    if (fr === 'expo') return `pnpm create expo-app@latest ${folderName} --template blank-typescript`;
    if (fr === 'react-native') return `pnpm dlx @react-native-community/cli init ${folderName} --version latest --pm pnpm --skip-install`;
    if (fr === 'flutter') return `flutter create ${folderName} --platforms=ios,android --org com.example`;
    if (fr === 'tauri') return `pnpm create tauri-app@latest ${folderName} --template react-ts --manager pnpm --identifier com.${folderName}.app --yes`;
    if (fr === 'electron') return `npm init electron-app@latest ${folderName} -- --template=webpack-typescript\ncd ${folderName}\ncorepack enable pnpm\npnpm import\nrm -f package-lock.json`;
    return '';
  };

  const scaffoldBackend = (folderName: string) => {
    if (be === 'django') return `pip install Django psycopg2-binary && django-admin startproject ${folderName} .`;
    if (be === 'fastapi') return `mkdir ${folderName} && cd ${folderName} && python -m venv .venv && source .venv/bin/activate && pip install fastapi uvicorn[standard]`;
    if (be === 'flask') return `mkdir ${folderName} && cd ${folderName} && python -m venv .venv && source .venv/bin/activate && pip install flask`;
    if (be === 'spring-boot') return `curl https://start.spring.io/starter.zip -d dependencies=web,data-jpa,postgresql -d name=${folderName} -d type=maven-project -o ${folderName}.zip && unzip ${folderName}.zip -d ${folderName}`;
    if (be === 'rails') return `rails new ${folderName} --database=postgresql --skip-git --skip-test=false`;
    if (be === 'laravel') return `composer create-project laravel/laravel ${folderName}`;
    if (be === 'gin' || be === 'echo' || be === 'fiber') return `mkdir ${folderName} && cd ${folderName} && go mod init ${folderName}`;
    if (be === 'express' || be === 'fastify' || be === 'nestjs') return `mkdir ${folderName} && cd ${folderName} && ${pkg} init`;
    return '';
  };

  if (isMonorepo) {
    const fCmd = scaffoldFrontend('web');
    if (fCmd) lines.push(fCmd);
    const bCmd = scaffoldBackend('api');
    if (bCmd) lines.push(bCmd);
    lines.push(`cd ..`); // back to root from apps
  } else {
    // Single app
    if (fr && fr !== 'none') {
      const cmd = scaffoldFrontend(name);
      if (cmd) lines.push(cmd);
      if (!cmd.includes(`cd ${name}`)) lines.push(`cd ${name}`);
    } else if (be && be !== 'none') {
      const cmd = scaffoldBackend(name);
      if (cmd) lines.push(cmd);
      if (!cmd.includes(`cd ${name}`) && !cmd.includes(`mkdir ${name} && cd ${name}`)) lines.push(`cd ${name}`);
    } else {
      lines.push(`mkdir ${name} && cd ${name}`);
    }
  }

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
  const langId = r.language?.id ?? 'typescript';

  // Python: emit pyproject.toml instead of package.json
  if (langId === 'python') {
    lines.push("cat > pyproject.toml <<'EOF'");
    lines.push('[project]');
    lines.push(`name = "${r.slug}"`);
    lines.push(`version = "0.1.0"`);
    lines.push(`requires-python = "${r.language?.version ?? '>=3.12'}"`);
    lines.push('dependencies = [');
    if (r.backend?.id === 'django') {
      lines.push('  "Django>=5.1",');
      lines.push('  "psycopg[binary]>=3.2",');
      lines.push('  "django-environ>=0.11",');
      lines.push('  "djangorestframework>=3.15",');
      lines.push('  "gunicorn>=23.0",');
    } else if (r.backend?.id === 'fastapi') {
      lines.push('  "fastapi>=0.115",');
      lines.push('  "uvicorn[standard]>=0.32",');
      lines.push('  "pydantic>=2.9",');
      lines.push('  "sqlalchemy>=2.0",');
      lines.push('  "alembic>=1.13",');
    } else if (r.backend?.id === 'flask') {
      lines.push('  "Flask>=3.0",');
      lines.push('  "Flask-SQLAlchemy>=3.1",');
      lines.push('  "Flask-Migrate>=4.0",');
      lines.push('  "gunicorn>=23.0",');
    }
    lines.push(']');
    lines.push('');
    lines.push('[project.optional-dependencies]');
    lines.push('dev = [');
    lines.push('  "pytest>=8.3",');
    lines.push('  "pytest-django>=4.9",');
    lines.push('  "pytest-cov>=6.0",');
    lines.push('  "pytest-mock>=3.14",');
    lines.push('  "ruff>=0.7",');
    lines.push('  "mypy>=1.13",');
    lines.push('  "factory-boy>=3.3",');
    lines.push('  "faker>=30.0",');
    lines.push(']');
    lines.push('');
    lines.push('[tool.ruff]');
    lines.push('line-length = 100');
    lines.push('target-version = "py312"');
    lines.push('');
    lines.push('[tool.ruff.lint]');
    lines.push('select = ["E","F","W","I","UP","B","SIM","RUF"]');
    lines.push('');
    lines.push('[tool.mypy]');
    lines.push('strict = true');
    lines.push('warn_unused_ignores = true');
    lines.push('');
    lines.push('[tool.pytest.ini_options]');
    lines.push('DJANGO_SETTINGS_MODULE = "config.settings.dev"');
    lines.push('addopts = "-q --strict-markers --strict-config"');
    lines.push('EOF');
    return lines.join('\n');
  }

  if (langId === 'go') {
    lines.push("cat > go.mod <<'EOF'");
    lines.push(`module ${r.slug}`);
    lines.push('');
    lines.push(`go ${r.language?.version ?? '1.23'}`);
    lines.push('EOF');
    return lines.join('\n');
  }

  if (langId === 'rust') {
    lines.push("cat > Cargo.toml <<'EOF'");
    lines.push('[package]');
    lines.push(`name = "${r.slug}"`);
    lines.push('version = "0.1.0"');
    lines.push('edition = "2021"');
    lines.push('');
    lines.push('[dependencies]');
    lines.push('tokio = { version = "1", features = ["full"] }');
    lines.push('serde = { version = "1", features = ["derive"] }');
    lines.push('anyhow = "1"');
    lines.push('EOF');
    return lines.join('\n');
  }

  lines.push("cat > package.json <<'EOF'");
  lines.push('{');
  lines.push(`  "name": "${r.slug}",`);
  lines.push(`  "version": "0.1.0",`);
  lines.push(`  "private": true,`);
  const runtime = RUNTIME_PKG[r.language?.id ?? 'typescript'] || RUNTIME_PKG.typescript;
  // engines (not root-level keys)
  lines.push(`  "engines": { ${runtime} },`);
  lines.push(`  "dependencies": {`);

  // Framework deps
  if (r.frontend?.id === 'nextjs') {
    lines.push(`  "next": "^15.0.0",`);
    lines.push(`  "react": "^18.3.1", "react-dom": "^18.3.1",`);
    if (r.language?.id === 'typescript') lines.push(`  "@t3-oss/env-nextjs": "^0.11.1",`);
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
    // @t3-oss/env: nextjs uses @t3-oss/env-nextjs (added above), all others use env-core
    if (r.frontend?.id !== 'nextjs') {
      lines.push(`  "@t3-oss/env-core": "^0.11.1",`);
    }
  }
  lines.push(`  "zod": "^3.23.0",`);
  if (r.thirdParty.payments?.id === 'stripe') lines.push(`  "stripe": "^17.0.0",`);
  if (r.thirdParty.email?.id === 'resend') lines.push(`  "resend": "^4.0.0",`);

  lines.push(`  },`);
  lines.push(`  "devDependencies": {`);
  if (r.language?.id === 'typescript') {
    lines.push(`    "typescript": "^5.6.0",`);
    lines.push(`    "@types/node": "^22.0.0",`);
  }
  if (r.design.css?.id === 'tailwind') lines.push(`    "tailwindcss": "^3.4.0",`);
  if (r.testing.unit?.id === 'vitest') lines.push(`    "vitest": "^2.1.0",`);
  if (r.testing.unit?.id === 'jest' || r.frontend?.id === 'electron') {
    lines.push(`    "jest": "^29.7.0",`);
    lines.push(`    "@types/jest": "^29.5.0",`);
    lines.push(`    "ts-jest": "^29.2.0",`);
  }
  if (r.testing.e2e?.id === 'playwright') lines.push(`    "@playwright/test": "^1.47.0",`);
  if (r.thirdParty.monitoring?.id === 'sentry') lines.push(`    "@sentry/node": "^8.0.0",`);
  lines.push(`    "eslint": "^9.0.0"`);
  lines.push(`  }`);
  lines.push(`}`);
  lines.push('EOF');
  if (r.devops.pkg?.id === 'pnpm') lines.push(`pnpm install`);
  else if (r.devops.pkg?.id === 'yarn') lines.push(`yarn install`);
  else if (r.devops.pkg?.id === 'bun') lines.push(`bun install`);
  else lines.push(`npm install`);

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
Testing           : ${r.testing.unit?.name ?? '—'}, ${r.testing.e2e && r.testing.e2e.id !== 'none' ? r.testing.e2e.name : '—'}, ${r.testing.api && r.testing.api.id !== 'none' ? r.testing.api.name : 'No API Tests'}
CI/CD             : ${r.devops.ci?.name ?? '—'}${r.devops.cd && r.devops.cd.id !== 'none' ? ` + ${r.devops.cd.name}` : ''}
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

${(() => {
  if (r.frontend?.id === 'tauri') {
    return `## 2b. Desktop Configuration (Tauri)

\`src-tauri/tauri.conf.json\`:
\`\`\`json
{
  "productName": "${r.name}",
  "identifier": "com.${r.slug}.app",
  "build": {
    "beforeBuildCommand": "${r.devops.pkg?.id ?? 'pnpm'} build",
    "beforeDevCommand": "${r.devops.pkg?.id ?? 'pnpm'} dev",
    "frontendDist": "../dist"
  },
  "app": {
    "security": {
      "csp": "default-src 'self'; script-src 'self'"
    },
    "windows": [{ "title": "${r.name}", "width": 1200, "height": 800 }]
  },
  "bundle": {
    "active": true,
    "targets": ["nsis", "dmg", "appimage", "deb"],
    "icon": ["icons/32x32.png", "icons/128x128.png", "icons/icon.ico"]
  }
}
\`\`\`

\`src-tauri/src/lib.rs\`:
\`\`\`rust
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
\`\`\`

---

`;
  }
  if (r.frontend?.id === 'electron') {
    return `## 2b. Desktop Configuration (Electron)

\`forge.config.ts\`:
\`\`\`ts
import type { ForgeConfig } from '@electron-forge/shared-types';
const config: ForgeConfig = {
  packagerConfig: { name: '${r.slug}', icon: './assets/icon' },
  makers: [
    { name: '@electron-forge/maker-squirrel', config: {} },
    { name: '@electron-forge/maker-dmg', config: {} },
    { name: '@electron-forge/maker-deb', config: {} },
  ],
};
export default config;
\`\`\`

---

`;
  }
  return '';
})()}

${(() => {
  if (r.frontend?.id === 'expo' || r.frontend?.id === 'react-native') {
    return `## 2c. Mobile Configuration (${r.frontend?.name})

\`app.json\`:
\`\`\`json
{
  "expo": {
    "name": "${r.name}",
    "slug": "${r.slug}",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "${r.slug}",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": { "bundleIdentifier": "com.${r.slug}.app", "supportsTablet": true },
    "android": { "package": "com.${r.slug}.app", "adaptiveIcon": { "foregroundImage": "./assets/adaptive-icon.png" } },
    "plugins": ["expo-router"]
  }
}
\`\`\`

---

`;
  }
  return '';
})()}

## 3. Coding Conventions${this.generateCodingConventions(r)}

- **Errors:** every async function wraps with \`try/catch\` that logs structured + reports to ${r.thirdParty.monitoring?.name ?? 'error tracker'}.

---

## 4. Security (non-negotiable)

| Rule | Implementation |
|------|----------------|
| HTTPS only | HSTS \`max-age=63072000; includeSubDomains; preload\` |
| Auth cookies | httpOnly + Secure + SameSite=Strict |
| Password hashing | bcrypt rounds=12 / argon2id |
| Rate limiting | 100 req/min/IP, 1000 req/hour/user |
| Input validation | ${this.validatorChoice(r)} at the API boundary |
| Env Variables | ${(['python', 'go', 'rust'].includes(r.language?.id ?? '')) ? 'Strict validation at startup via pydantic-settings / env struct / dotenv' : 'Strict type-checking at build time via t3-env / Zod'} |
| CSRF | double-submit cookie pattern |
| Security headers | CSP, X-Frame-Options=DENY, Referrer-Policy=strict-origin-when-cross-origin |
| Secrets | ${r.hosting.frontend?.name ?? 'platform'} env vars + ${r.devops.iac && r.devops.iac.id !== 'none' ? r.devops.iac.name : 'AWS KMS / GCP Secret Manager'} for prod |
${r.db.primary && r.db.primary.id === 'supabase-db' ? '| RLS | enabled on every table; deny by default |' : ''}
${(r.frontend?.id === 'tauri' || r.frontend?.id === 'electron') ? `| Trust boundary | Frontend is UNTRUSTED. All sensitive ops go through ${r.frontend?.id === 'tauri' ? 'Tauri Commands (invoke)' : 'IPC (ipcMain/ipcRenderer)'} |
| Secret storage | Platform-native (${r.frontend?.id === 'tauri' ? 'keyring crate → ' : ''}Windows Credential Manager / macOS Keychain / Linux Secret Service) |
| IPC security | Whitelist allowed ${r.frontend?.id === 'tauri' ? 'commands in tauri.conf.json capabilities' : 'IPC channels in preload.ts'} |` : ''}
${dataNeedsGDPR(data) ? '| GDPR/CCPA | data export, 30-day deletion grace, consent log |\n| Sensitive columns | AES-256-GCM or pgcrypto |' : ''}

---

${buildEnvValidationSnippet(r)}

${buildDockerSnippet(r)}

${buildCiCdSnippet(r)}

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
${(() => {
  const langId = (r.language?.id ?? 'typescript') as string;
  if (langId === 'python') {
    return `pytest                              # unit
pytest --integration       # integration
pytest --cov=apps --cov-report=term-missing  # coverage
coverage report --fail-under=${r.testing.coverage}`;
  }
  if (langId === 'go') {
    return `go test ./...                       # unit
go test -tags=e2e ./tests/e2e/...  # e2e
go test -coverprofile=cover.out ./...`;
  }
  if (langId === 'rust') {
    return `cargo test                          # unit
cargo test --test integration         # e2e
cargo tarpaulin --fail-under ${r.testing.coverage}  # coverage`;
  }
  const pkg = r.devops.pkg?.id ?? 'npm';
  const testScript = r.testing.unit?.id === 'vitest' ? 'vitest run' : r.testing.unit?.id === 'jest' ? 'jest' : 'test';
  return `# ${r.testing.unit?.name ?? 'unit tests'} (single test runner is the source of truth)
${pkg} ${testScript}                                # unit
${pkg} ${testScript} --coverage                     # coverage report (target: ${r.testing.coverage}%)
# E2E / a11y run via Playwright/Cypress — see e2e directory.`;
})()}
\`\`\`

Coverage target: **${r.testing.coverage}%**. Enforced in CI.

---

## 9. CI/CD (${r.devops.ci?.name ?? 'GitHub Actions'})

${(() => {
  const ci = r.devops.ci?.id ?? 'github-actions';
  if (ci === 'gitlab-ci') {
    return 'Workflow file: **`.gitlab-ci.yml`** in the project root. Required jobs per MR/push:';
  }
  if (ci === 'circleci') {
    return 'Workflow file: **`.circleci/config.yml`**. Required jobs per PR:';
  }
  if (ci === 'bitbucket-pipelines') {
    return 'Workflow file: **`bitbucket-pipelines.yml`** in the project root. Required jobs per PR:';
  }
  return 'Workflow files go in **`.github/workflows/`**. Required jobs per PR:';
})()}

${(() => {
  const langId = (r.language?.id ?? 'typescript') as string;
  const isDesktop = r.frontend?.id === 'electron' || r.frontend?.id === 'tauri';
  if (langId === 'python') {
    return `1. \`lint\` — \`ruff check .\` then \`ruff format --check .\`
2. \`typecheck\` — \`mypy --strict .\`
3. \`test\` — \`pytest --maxfail=1 -q --cov=apps --cov-report=xml\`
4. \`security\` — \`pip-audit\` + \`bandit -r apps/\`
5. \`migrate-check\` — \`python manage.py makemigrations --check --dry-run\`
6. \`build\` — \`python manage.py collectstatic --noinput\` then \`python manage.py check --deploy\`
7. \`preview\` — deploy to ${r.hosting.backend?.name ?? 'preview environment'}`;
  }
  if (langId === 'go') {
    return `1. \`lint\` — \`golangci-lint run ./...\`
2. \`typecheck\` — \`go vet ./...\` then \`staticcheck ./...\`
3. \`test\` — \`go test -race -coverprofile=cover.out ./...\`
4. \`build\` — \`go build -o bin/app ./...\`
5. \`preview\` — deploy to ${r.hosting.backend?.name ?? 'preview environment'}`;
  }
  if (langId === 'rust') {
    return `1. \`lint\` — \`cargo fmt --check\` then \`cargo clippy -- -D warnings\`
2. \`test\` — \`cargo test --all\`
3. \`build\` — \`cargo build --release\`
4. \`audit\` — \`cargo audit\`
5. \`release\` — deploy to ${r.hosting.backend?.name ?? 'preview environment'}`;
  }
  const pkg = r.devops.pkg?.id ?? 'pnpm';
  if (isDesktop) {
    return `1. \`typecheck\` — \`${pkg} ${r.scripts.typecheck}\`
2. \`lint\` — \`${pkg} ${r.scripts.lint}\`
3. \`test\` — \`${pkg} test\`
4. \`build\` — \`${pkg} build\` (${r.frontend?.id === 'tauri' ? 'Tauri builds' : 'electron-builder packages'} .exe / .dmg / .AppImage)
5. \`release\` — upload artifacts to GitLab Releases / GitHub Releases (no web preview — desktop app is distributed as installer)`;
  }
  return `1. \`typecheck\` — \`${pkg} ${r.scripts.typecheck}\`
2. \`lint\` — \`${pkg} ${r.scripts.lint}\`
3. \`test\` — \`${pkg} test\`
4. \`build\` — \`${pkg} build\`
5. \`preview\` — deploy to ${r.hosting.frontend?.name ?? r.hosting.backend?.name ?? 'preview environment'}`;
})()}

---

## 10. Performance Budgets (enforced in CI)

${(() => {
  const langId = (r.language?.id ?? 'typescript') as string;
  if (langId === 'python') {
    return `| Metric | Target |
|--------|--------|
| Response (p50) | < 100ms |
| Response (p95) | < 400ms |
| DB query (p95) | < 50ms |
| Worker job (p95) | < 5s |
| Static page gzip | < 200 KB |`;
  }
  if (langId === 'go' || langId === 'rust') {
    return `| Metric | Target |
|--------|--------|
| Response (p50) | < 50ms |
| Response (p95) | < 250ms |
| Binary size | < 30 MB |
| Goroutine/thread count | < 1000 / request |`;
  }
  return `| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| CLS | < 0.1 |
| TBT | < 300ms |
| JS bundle (route) | < 300 KB gzipped |`;
})()}

---

## 11. Accessibility (WCAG 2.2 AA)

${(() => {
  const langId = (r.language?.id ?? 'typescript') as string;
  if (langId === 'python') {
    return `- Semantic Django/Jinja template tags ({% url %}, {% csrf_token %}). No form helpers bypassed.
- Visible focus rings on every \`<button>\`, \`<a>\`, \`<input>\`.
- Color contrast ≥ 4.5:1 (text), 3:1 (large + UI).
- django-accessibility tests in CI; build fails on serious/critical issues.
- Keyboard navigation works for every flow.`;
  }
  return `- Semantic HTML (no \`<div onClick>\`).
- Visible focus rings on every interactive element.
- Color contrast ≥ 4.5:1 (text), 3:1 (large + UI).
- axe-core in CI; build fails on serious/critical issues.
- Keyboard navigation works for every flow.`;
})()}

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
${(() => {
  const langId = (r.language?.id ?? 'typescript') as string;
  if (langId === 'python') {
    return `- Use Python ${r.language?.version ?? '>=3.12'} with PEP 8 + type hints everywhere.
- Run \`ruff check .\` and \`ruff format --check .\` in CI.
- Run \`mypy --strict\` in CI.
- Validate inputs server-side, never trust the client.
- Store passwords with bcrypt (rounds=12) or argon2id-cffi.
- Sessions in httpOnly, Secure, SameSite=Lax cookies (Django: \`SESSION_COOKIE_SECURE=True\`).
- All money as integers (cents). Never floats.
- All timestamps as UTC (Django: \`USE_TZ=True\`, time-zone-aware datetimes).
- Use pytest for tests with pytest-django + factory_boy. Mock external services with pytest-mock.`;
  }
  if (langId === 'go') {
    return `- Use Go ${r.language?.version ?? '>=1.23'} modules with \`go vet\` + \`golangci-lint\`.
- Validate inputs server-side, never trust the client.
- Store passwords with bcrypt (cost=12) or argon2.
- Use chi or stdlib mux + context for HTTP. Never \`context.Background()\` mid-chain.
- All money as integers (cents). Never floats.
- All timestamps as UTC, time.Time only.
- Use \`testing\` package + table-driven tests. Mock external services.`;
  }
  if (langId === 'rust') {
    return `- Use Rust ${r.language?.version ?? '>=1.81'} edition 2021 with clippy::pedantic as CI gate.
- Validate inputs server-side, never trust the client.
- Store passwords with bcrypt or argon2 crate.
- All money as integers (cents). Never floats.
- Use chrono::DateTime<Utc> for all timestamps.
- Use built-in #[test] + #[tokio::test] for async.`;
  }
  return `- Use TypeScript strict mode. No \`any\`, no \`@ts-ignore\`.
- Use ${this.validatorChoice(r)} at every API boundary.
- Validate inputs server-side, never trust the client.
- Store passwords with bcrypt (rounds=12) or argon2id.
- Sessions in httpOnly, Secure, SameSite=Strict cookies.
- All money as integers (cents). Never floats.
- All timestamps as UTC (TIMESTAMPTZ). Format at the edge only.
- Use ${r.testing.unit?.name ?? 'vitest'} for tests. Mock external services.
- Type every function param and return value.`;
})()}

# === NEVER ===
- Never store secrets in code or committed .env files.
- Never use \`localStorage\` for JWT or any auth token.
- Never commit console.log for debugging — use a structured logger.
${['vue', 'nuxt'].includes(r.frontend?.id ?? '') ? '- Never use `document.querySelector` in Vue component code — use template refs.' : ['react', 'nextjs', 'remix', 'preact', 'solid'].includes(r.frontend?.id ?? '') ? '- Never use `document.querySelector` in React code — use refs.' : ['svelte', 'sveltekit'].includes(r.frontend?.id ?? '') ? '- Never use `document.querySelector` in Svelte code — use bind:this.' : '- Never manipulate the DOM directly — use framework primitives.'}
- Never disable linter rules to silence warnings.
- Never use float for currency.
- Never use scripts that don't match the framework choice (e.g., \`next dev\` for a Vite project).

# === TESTS TO GENERATE PER NEW FILE ===
${(() => {
  const langId = (r.language?.id ?? 'typescript') as string;
  if (langId === 'python') {
    return `- Every view → success + 4xx + 5xx path (\`test_<view>.py\`).
- Every service → unit tests covering happy + error paths (\`test_<service>.py\`).
- Every model → factory_boy + serializer round-trip.
- Mock external services at module boundary with pytest-mock.`;
  }
  if (langId === 'go') {
    return `- Every handler → success + 4xx + 5xx path (\`<handler>_test.go\`).
- Every service → unit tests covering happy + error paths.
- Mock external services at module boundary (httptest, sqlmock).`;
  }
  if (langId === 'rust') {
    return `- Every handler → success + 4xx + 5xx path (\`<module>_test.rs\`).
- Every service → unit tests covering happy + error paths.
- Mock external services with wiremock-rs or testcontainers.`;
  }
  return `- Every component → render test + a11y test.
- Every route handler → success + 4xx + 5xx path.
- Every service → unit tests covering happy + error paths.
- Mock external services at module boundary.`;
})()}

# === FILE NAMING ===
${(() => {
  const langId = (r.language?.id ?? 'typescript') as string;
  if (langId === 'python') {
    return `- Modules     : snake_case — \`user_profile.py\`
- Classes     : PascalCase — \`UserProfile\`
- Functions   : snake_case — \`format_date()\`
- Tests       : \`test_*.py\` next to the code they cover
- Migrations  : \`<app>/migrations/0001_initial.py\` (auto-generated)`;
  }
  if (langId === 'go') {
    return `- Packages    : lowercase, single word — \`userprofile\`
- Files       : snake_case — \`user_profile.go\`
- Tests       : \`<file>_test.go\` next to the code they cover`;
  }
  if (langId === 'rust') {
    return `- Modules     : snake_case — \`user_profile.rs\`
- Types       : PascalCase — \`UserProfile\`
- Tests       : nested \`#[cfg(test)]\` or in \`tests/\` directory`;
  }
  const ext = r.frontend?.id === 'vue' || r.frontend?.id === 'nuxt' ? 'vue' : r.frontend?.id === 'svelte' || r.frontend?.id === 'sveltekit' ? 'svelte' : r.frontend?.id === 'astro' ? 'astro' : 'tsx';
  const fwName = r.frontend?.id === 'vue' || r.frontend?.id === 'nuxt' ? 'Vue' : r.frontend?.id === 'svelte' || r.frontend?.id === 'sveltekit' ? 'Svelte' : r.frontend?.id === 'angular' ? 'Angular' : 'React';
  return `- ${fwName} components  : PascalCase — Button.${ext}
- Utilities        : camelCase — formatDate.ts
- Route handlers   : kebab-case — user-profile/route.ts
- Tests            : *.test.${ext === 'tsx' ? 'tsx' : 'ts'} or *.spec.ts`;
})()}
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
      const langId = (r.language?.id ?? 'typescript') as string;
      if (langId === 'python') {
        return `\`\`\`sql
-- Local SQLite. Access via SQLAlchemy 2.x or Django ORM.
CREATE TABLE users (
  id TEXT PRIMARY KEY,            -- uuid v4 (stored as text)
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
\`\`\``;
      }
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
    const langId = (r.language?.id ?? 'typescript') as string;
    if (langId === 'python') {
      return `Define models with SQLAlchemy 2.x (declarative + Mapped types) or Django ORM. Every model MUST have: id (UUID, server_default), created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ). Soft-delete via deleted_at where appropriate. Use Alembic (SQLAlchemy) or Django migrations exclusively — never edit migrations by hand.`;
    }
    if (langId === 'go') {
      return `Define entities with GORM or sqlc-generated models. Every entity MUST have: id (UUID), created_at, updated_at. Use go-migrate for migrations.`;
    }
    if (langId === 'rust') {
      return `Define models with SQLx (compile-time checked queries) or Diesel. Every entity MUST have: id (UUID), created_at, updated_at.`;
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
    const langId = (r.language?.id ?? 'typescript') as string;
    const validator =
      langId === 'python'
        ? r.backend.id === 'fastapi'
          ? 'Pydantic v2'
          : r.backend.id === 'django'
          ? 'DRF serializers + Django Forms'
          : 'pydantic + marshmallow'
        : langId === 'go'
        ? 'go-playground/validator + binding tags'
        : langId === 'rust'
        ? 'serde + validator crate'
        : 'Zod';
    return `RESTful endpoints under \`/api/v1/\`. Each endpoint:
- Validates input with **${validator}**
- Returns 2xx with DTO or 4xx/5xx with { error: { code, message } }
- Requires auth (except /health, /auth/*)
- Logs every request with correlation ID`;
  }

  private validatorChoice(r: Resolved): string {
    const langId = (r.language?.id ?? 'typescript') as string;
    const be = r.backend?.id ?? '';
    if (langId === 'python') {
      if (be === 'fastapi') return 'Pydantic v2 models';
      if (be === 'django') return 'DRF serializers + Django Forms';
      if (be === 'flask') return 'pydantic + marshmallow schemas';
      return 'Pydantic v2 models';
    }
    if (langId === 'go') return 'go-playground/validator + binding tags';
    if (langId === 'rust') return 'serde + validator crate';
    return 'Zod schemas';
  }

  private generateUiSection(r: Resolved): string {
    if (r.frontend?.id === 'none' || !r.frontend?.id || (r.frontend as any) === '') {
      return `This project uses server-rendered templates (or no separate UI layer). All HTML lives under /templates/. No JSX or React-style component libraries apply — use Django templates + HTMX/Turbo, or Jinja2 for pure-API projects.`;
    }
    const compExt = r.frontend?.id === 'vue' || r.frontend?.id === 'nuxt' ? 'vue' : r.frontend?.id === 'svelte' || r.frontend?.id === 'sveltekit' ? 'svelte' : 'tsx';
    return `Components live in ${r.frontend?.id === 'nuxt' ? 'app/components/' : r.frontend?.id === 'sveltekit' ? 'src/lib/components/' : 'src/components/'}. For every shared component:
- Storybook story (or equivalent) at .stories.${compExt === 'vue' ? 'ts' : compExt}
- a11y: keyboard navigable, visible focus, ARIA labels
- Dark mode via CSS variables (no JS theme)
- Responsive: mobile-first (320 → 1920px)
${r.design.comp?.id === 'shadcn-ui' ? '- Use shadcn/ui primitives — install via `pnpm dlx shadcn@latest add <name>`' : ''}`;
  }

  private generateCodingConventions(r: Resolved): string {
    const lang = (r.language?.id ?? 'typescript') as string;

    // Python / Django / FastAPI / Flask
    if (lang === 'python') {
      return `

- **Language:** Python ${r.language?.version ?? '>=3.12'} with **type hints** everywhere (\`from __future__ import annotations\`).
- **Style:** PEP 8 + Ruff formatter (\`ruff format\` + \`ruff check .\`).
- **Type checking:** mypy in strict mode (\`--strict\`, \`--warn-unused-ignores\`).
- **Imports:** absolute imports only. Group: stdlib → third-party → local. Use \`apps.<app>.models\` style, never \`from .models\`.
- **Naming:** \`snake_case\` for functions/variables/modules, \`PascalCase\` for classes, \`UPPER_SNAKE_CASE\` for constants.
- **Tests:** pytest + pytest-django. Every test file = \`test_<thing>.py\`. Use factories (factory_boy) not fixtures for objects.
- **Async:** \`async def\` only when truly I/O-bound. CPU work stays sync.
- **Comments:** docstrings on every public function/class (\`"""triple quotes"""\`). Google style preferred.
- **No type:\`any\`:** use \`typing.Any\` only as a last resort and with comment.`;
    }

    // Go
    if (lang === 'go') {
      return `

- **Language:** Go ${r.language?.version ?? '>=1.23'} (modules, \`go mod\`).
- **Style:** \`gofmt\` + \`go vet\` + \`golangci-lint\`.
- **Errors:** always check them. Wrap with \`fmt.Errorf("...: %w", err)\`.
- **Naming:** \`CamelCase\` for exported, \`camelCase\` for unexported. No \`_\` in identifiers.
- **Logging:** use \`slog\` from stdlib.
- **Tests:** standard testing package + table-driven tests. File = \`<thing>_test.go\`.
- **HTTP:** \`net/http\` with chi or stdlib mux. Context-first signatures.`;
    }

    // Rust
    if (lang === 'rust') {
      return `

- **Language:** Rust ${r.language?.version ?? '>=1.81'} (edition 2021).
- **Style:** \`rustfmt\` + \`clippy::pedantic\` warnings as errors.
- **Errors:** \`thiserror\` for crates, \`anyhow\` for apps. Never \`unwrap()\` in production paths.
- **Naming:** \`snake_case\` files/modules, \`PascalCase\` types, \`SCREAMING_SNAKE_CASE\` consts.
- **Concurrency:** \`tokio\` runtime. \`async fn\` for I/O. \`Send + Sync\` only when needed.
- **Tests:** built-in \`#[test]\` + \`#[tokio::test]\` for async. Integration tests in \`tests/\` dir.
- **Web:** \`axum\` or \`actix-web\` (matches chosen backend).`;
    }

    // Default = JS / TS family
    return `

- **Language:** ${r.language?.name ?? 'TypeScript'} — **strict mode enabled** (\`"strict": true\`).
- **Imports:** absolute via path alias \`@/\` → \`./src/\`.
- **Components:** ${r.frontend?.id === 'vue' || r.frontend?.id === 'nuxt' ? 'Composition API + <script setup>. No Options API.' : r.frontend?.id === 'svelte' || r.frontend?.id === 'sveltekit' ? 'Svelte components with <script lang="ts">. Use stores for state.' : r.frontend?.id === 'angular' ? 'Standalone components with signals. No legacy modules.' : 'function components + hooks only. No class components.'}
- **Naming:** PascalCase files for components (\`Button.${r.frontend?.id === 'vue' || r.frontend?.id === 'nuxt' ? 'vue' : r.frontend?.id === 'svelte' || r.frontend?.id === 'sveltekit' ? 'svelte' : r.frontend?.id === 'astro' ? 'astro' : r.frontend?.id === 'angular' ? 'component.ts' : 'tsx'}\`); camelCase for utilities.
- **Comments:** JSDoc on every exported function. Inline ONLY for non-obvious logic.`;
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
  const langId = (r.language?.id ?? 'typescript') as string;
  const items: string[] = [];
  if (langId === 'python') {
    items.push('- [ ] `ruff check .` and `ruff format --check .` produce no errors');
    items.push('- [ ] `mypy --strict .` passes with zero errors');
    items.push('- [ ] All Django migrations generated via `manage.py makemigrations` (no hand-edits)');
    items.push('- [ ] `python manage.py check --deploy` produces no warnings');
  } else if (langId === 'go') {
    items.push('- [ ] `golangci-lint run ./...` produces no errors');
    items.push('- [ ] `go vet ./...` and `staticcheck ./...` produce no warnings');
  } else if (langId === 'rust') {
    items.push('- [ ] `cargo fmt --check` and `cargo clippy -- -D warnings` produce no errors');
    items.push('- [ ] `cargo audit` reports no advisories');
  } else {
    items.push('- [ ] All TypeScript files compile with strict mode, zero `any`');
    items.push('- [ ] No ESLint warnings, no console.log left in code');
  }
  items.push(
    `- [ ] Test coverage ≥ ${r.testing.coverage}% (enforced in CI)`,
  );
  if (langId === 'python') {
    items.push('- [ ] Response time p95 < 400ms (Django + DB queries profiled)');
  } else {
    items.push('- [ ] Lighthouse CI passes: LCP < 2.5s, CLS < 0.1, TBT < 300ms');
    items.push('- [ ] axe-core shows zero serious/critical issues');
  }
  items.push(
    '- [ ] All API endpoints have unit + integration tests',
    '- [ ] Auth uses httpOnly cookies, passwords hashed',
    '- [ ] All timestamps are UTC',
    '- [ ] README explains setup, scripts, and architecture',
    ...(r.projectType?.id === 'web-app' ? ['- [ ] Preview deployment works on every PR'] : [])
  );
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




// =====================================================================
//   Vibe-Coder 3.0: Enterprise Code Injection Snippets
// =====================================================================

function buildDockerSnippet(r: Resolved): string {
  const isGo = r.language?.id === 'go';
  const isRust = r.language?.id === 'rust';
  const isPython = r.language?.id === 'python';
  const isNext = r.frontend?.id === 'nextjs';
  const isNuxt = r.frontend?.id === 'nuxt';

  let dockerfile = '';
  if (isGo) {
    dockerfile = `
FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM gcr.io/distroless/static:nonroot
WORKDIR /
COPY --from=builder /app/main .
USER 65532:65532
EXPOSE 8080
CMD ["/main"]`;
  } else if (isRust) {
    dockerfile = `
FROM rust:1.81 as builder
WORKDIR /usr/src/app
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/src/app/target/release/app /usr/local/bin/app
EXPOSE 8080
CMD ["app"]`;
  } else if (isPython) {
    dockerfile = `
FROM python:3.12-slim AS builder
WORKDIR /app
RUN pip install uv
COPY pyproject.toml requirements.txt ./
RUN uv pip install --system -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
COPY . .
EXPOSE 8000
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]`;
  } else if (isNext) {
    dockerfile = `
FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "server.js"]`;
  } else {
    // Generic Node.js Dockerfile
    dockerfile = `
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile
COPY . .
RUN corepack enable pnpm && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
RUN corepack enable pnpm && pnpm i --prod
EXPOSE 3000
CMD ["npm", "start"]`;
  }

  return `\n## 4c. Containerization (Docker)\n\nCreate exactly this \`Dockerfile\`:\n\`\`\`dockerfile${dockerfile}\n\`\`\`\n`;
}

function buildCiCdSnippet(r: Resolved): string {
  const isGo = r.language?.id === 'go';
  const isRust = r.language?.id === 'rust';
  const isPython = r.language?.id === 'python';
  
  let steps = '';
  if (isGo) {
    steps = `
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: go vet ./...
      - run: go test -v ./...`;
  } else if (isRust) {
    steps = `
      - uses: actions-rs/toolchain@v1
        with:
          profile: minimal
          toolchain: stable
          components: clippy
      - run: cargo clippy -- -D warnings
      - run: cargo test`;
  } else if (isPython) {
    steps = `
      - uses: actions/setup-python@v5
        with:
          python-version: '3.12'
      - run: pip install uv && uv pip install --system -r requirements.txt
      - run: ruff check .
      - run: pytest`;
  } else {
    steps = `
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: corepack enable pnpm
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm test`;
  }

  return `\n## 4d. CI/CD Pipeline\n\nCreate exactly this \`.github/workflows/ci.yml\`:\n\`\`\`yaml\nname: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4${steps}\n\`\`\`\n`;
}



function buildEnvValidationSnippet(r: Resolved): string {
  const isNext = r.frontend?.id === 'nextjs';
  const envPkg = isNext ? '@t3-oss/env-nextjs' : '@t3-oss/env-core';
  const isNode = ['typescript', 'javascript'].includes(r.language?.id ?? '');
  
  if (!isNode) {
    return `## 4b. Environment Variables (Type-Safe)\n\nUse ` + (r.language?.id === 'python' ? 'pydantic-settings' : 'env struct') + ` to strictly validate env variables on startup. Never use raw os.environ.\n`;
  }

  const lines = [];
  lines.push(`## 4b. Environment Variables (Type-Safe)\n\nCreate \`src/env.ts\` with strict Zod validation:\n\`\`\`ts\nimport { createEnv } from "${envPkg}";\nimport { z } from "zod";\n\nexport const env = createEnv({\n  server: {`);
  if (r.db.primary && r.db.primary.id !== 'none' && r.db.primary.id !== 'sqlite') {
    lines.push(`    DATABASE_URL: z.string().url(),`);
  }
  if (r.auth.primary && r.auth.primary.id !== 'none') {
    lines.push(`    AUTH_SECRET: z.string().min(32),`);
  }
  if (r.thirdParty.payments && r.thirdParty.payments.id !== 'none') {
    const prefix = r.thirdParty.payments.id === 'stripe' ? 'STRIPE' : r.thirdParty.payments.id === 'lemonsqueezy' ? 'LEMON_SQUEEZY' : 'PAYMENT';
    lines.push(`    ${prefix}_SECRET_KEY: z.string().min(1),`);
    lines.push(`    ${prefix}_WEBHOOK_SECRET: z.string().min(1),`);
  }
  if (r.thirdParty.monitoring && r.thirdParty.monitoring.id === 'sentry') {
    lines.push(`    SENTRY_DSN: z.string().url(),`);
  }
  if (r.thirdParty.storage && r.thirdParty.storage.id !== 'none') {
    lines.push(`    S3_BUCKET: z.string().min(1),`);
    lines.push(`    S3_REGION: z.string().min(1),`);
  }
  lines.push(`  },`);
  if (isNext || r.frontend?.id === 'react' || r.frontend?.id === 'vue' || r.frontend?.id === 'svelte') {
    const prefix = isNext ? 'NEXT_PUBLIC_' : 'VITE_';
    lines.push(`  client: {`);
    lines.push(`    ${prefix}APP_URL: z.string().url(),`);
    if (r.thirdParty.analytics && r.thirdParty.analytics.id !== 'none') {
      lines.push(`    ${prefix}ANALYTICS_ID: z.string().min(1),`);
    }
    lines.push(`  },`);
  }
  lines.push(`});\n\`\`\`\n\n**Rule:** Import \`env\` from this file everywhere. Never use \`process.env\` directly.\n`);
  return lines.join('\n');
}
