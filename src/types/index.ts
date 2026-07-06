// =====================================================================
//   Core Types — single source of truth for the wizard data shape
//   Organized so each field maps to exactly one wizard step (no overlap).
// =====================================================================

// ---- 1. Project identity ----
export type LocaleId =
  | 'en' | 'ar' | 'es' | 'fr' | 'de' | 'pt' | 'ru'
  | 'zh-CN' | 'zh-TW' | 'ja' | 'ko' | 'hi' | 'tr'
  | 'it' | 'nl' | 'pl' | 'uk' | 'vi' | 'th' | 'id'
  | 'he' | 'fa' | 'ur';

export interface ProjectIdentity {
  name: string;
  description: string;
  targetAudience: string;
  projectType: ProjectTypeId | '';
}

// ---- 2. Project Type ----
export type ProjectTypeId =
  | 'web-app' | 'mobile-app' | 'desktop-app'
  | 'saas-platform' | 'ecommerce' | 'marketplace'
  | 'social-network' | 'blog-cms' | 'landing-page'
  | 'api-backend' | 'ai-ml-app' | 'data-dashboard'
  | 'game' | 'iot' | 'blockchain-web3'
  | 'chrome-extension' | 'cli-tool' | 'library-sdk';

// ---- 3. Language ----
export type LanguageId =
  | 'typescript' | 'javascript' | 'python' | 'go' | 'rust'
  | 'java' | 'kotlin' | 'swift' | 'ruby' | 'php'
  | 'elixir' | 'scala' | 'dart' | 'cpp' | 'csharp' | 'solidity';

// ---- 4. Frontend ----
export type FrontendId =
  | 'react' | 'nextjs' | 'remix' | 'vue' | 'nuxt' | 'angular'
  | 'svelte' | 'sveltekit' | 'solid' | 'astro' | 'qwik' | 'ember'
  | 'preact' | 'lit' | 'react-native' | 'expo' | 'flutter'
  | 'swiftui' | 'jetpack-compose' | 'tauri' | 'electron' | 'none';

// ---- 5. Backend ----
export type BackendId =
  | 'express' | 'fastify' | 'nestjs' | 'hono' | 'koa'
  | 'django' | 'fastapi' | 'flask' | 'spring-boot' | 'rails'
  | 'laravel' | 'symfony' | 'gin' | 'echo' | 'fiber'
  | 'actix' | 'axum' | 'aspnet' | 'phoenix' | 'none';

/** Wizard may have an unset state (empty string) before user picks. */
export type BackendIdOrEmpty = BackendId | '';

// ---- 6. Database stack (each layer is independent) ----
export type DatabasePrimaryId =
  | 'postgresql' | 'mysql' | 'mariadb' | 'sqlite'
  | 'mongodb' | 'couchdb' | 'dynamodb' | 'cosmosdb' | 'firestore'
  | 'cassandra' | 'tidb' | 'cockroachdb' | 'planetscale'
  | 'neon' | 'supabase-db' | 'none';

export type CacheId =
  | 'redis' | 'memcached' | 'keydb' | 'dragonfly' | 'upstash-redis' | 'none';

export type VectorId =
  | 'pgvector' | 'pinecone' | 'weaviate' | 'chroma' | 'qdrant'
  | 'milvus' | 'lancedb' | 'turbopuffer' | 'none';

export type SearchId =
  | 'elasticsearch' | 'opensearch' | 'meilisearch' | 'typesense'
  | 'algolia' | 'orama' | 'none';

export type AnalyticsDbId =
  | 'clickhouse' | 'duckdb' | 'snowflake' | 'bigquery' | 'redshift' | 'none';

export type GraphId =
  | 'neo4j' | 'arangodb' | 'tigergraph' | 'neptune' | 'dgraph' | 'none';

export type TimeSeriesId =
  | 'timescaledb' | 'influxdb' | 'questdb' | 'prometheus' | 'victoria-metrics' | 'none';

export interface DatabaseStack {
  primary: DatabasePrimaryId;
  cache: CacheId;
  vector: VectorId;
  search: SearchId;
  analytics: AnalyticsDbId;
  graph: GraphId;
  timeseries: TimeSeriesId;
}

// ---- 7. Hosting ----
export type FrontendHostingId =
  | 'vercel' | 'netlify' | 'cloudflare-pages' | 'aws-amplify'
  | 'firebase-hosting' | 'azure-static-web-apps' | 'github-pages'
  | 'render-static' | 'self-hosted-nginx' | 'none';

export type BackendHostingId =
  | 'vercel-functions' | 'netlify-functions' | 'cloudflare-workers'
  | 'aws-lambda' | 'aws-ecs' | 'aws-fargate' | 'aws-ec2'
  | 'gcp-cloud-run' | 'gcp-app-engine' | 'gcp-gke'
  | 'azure-app-service' | 'azure-container-apps'
  | 'railway' | 'render' | 'fly-io' | 'digitalocean-app'
  | 'heroku' | 'docker-self-hosted' | 'kubernetes-self-hosted' | 'none';

export type DatabaseHostingId =
  | 'supabase' | 'neon' | 'planetscale' | 'railway-db' | 'render-postgres'
  | 'aws-rds' | 'aws-aurora' | 'gcp-cloud-sql' | 'azure-cosmos'
  | 'mongodb-atlas' | 'upstash' | 'turso' | 'self-hosted-docker' | 'none';

export type CdnId =
  | 'cloudflare' | 'cloudfront' | 'fastly' | 'bunny-cdn' | 'akamai' | 'keycdn' | 'none';

export type OrchestrationId =
  | 'kubernetes' | 'docker-compose' | 'docker-swarm' | 'nomad'
  | 'ecs' | 'gke' | 'aks' | 'eks' | 'none';

export interface HostingStack {
  frontend: FrontendHostingId;
  backend: BackendHostingId;
  database: DatabaseHostingId;
  cdn: CdnId;
  orchestration: OrchestrationId;
}

// ---- 8. Auth ----
export type AuthProviderId =
  | 'supabase-auth' | 'clerk' | 'auth0' | 'firebase-auth' | 'cognito'
  | 'nextauth' | 'lucia' | 'better-auth' | 'keycloak'
  | 'workos' | 'okta' | 'custom-jwt' | 'custom-session' | 'none';

export type SocialProviderId =
  | 'google' | 'github' | 'apple' | 'facebook' | 'microsoft'
  | 'twitter-x' | 'linkedin' | 'discord' | 'gitlab' | 'bitbucket';

export interface AuthStack {
  primary: AuthProviderId | '';
  socialProviders: SocialProviderId[];
  enterpriseSso: boolean;
  mfaRequired: boolean;
}

// ---- 9. Third-party services ----
export type PaymentId =
  | 'stripe' | 'paypal' | 'paddle' | 'lemonsqueezy' | 'razorpay'
  | 'square' | 'adyen' | 'mollie' | 'checkoutcom' | 'none';

export type EmailId =
  | 'sendgrid' | 'resend' | 'postmark' | 'mailgun' | 'amazon-ses' | 'plunk' | 'loops' | 'none';

export type SmsId =
  | 'twilio' | 'messagebird' | 'vonage' | 'aws-sns' | 'plivo' | 'none';

export type AnalyticsId =
  | 'google-analytics' | 'mixpanel' | 'amplitude' | 'posthog'
  | 'plausible' | 'fathom' | 'umami' | 'datadog-rum' | 'sentry-replay' | 'none';

export type MonitoringId =
  | 'sentry' | 'datadog' | 'new-relic' | 'grafana-cloud'
  | 'honeybadger' | 'rollbar' | 'axiom' | 'logflare' | 'none';

export type StorageId =
  | 'aws-s3' | 'cloudflare-r2' | 'backblaze-b2' | 'google-cloud-storage'
  | 'azure-blob' | 'supabase-storage' | 'uploadthing' | 'none';

export type ManagedSearchId =
  | 'algolia' | 'meilisearch-cloud' | 'typesense-cloud'
  | 'elasticsearch-cloud' | 'orama-cloud' | 'none';

export type FeatureFlagsId =
  | 'launchdarkly' | 'growthbook' | 'posthog-flags'
  | 'unleash' | 'flagsmith' | 'configcat' | 'none';

export interface ThirdPartyStack {
  payments: PaymentId;
  email: EmailId;
  sms: SmsId;
  analytics: AnalyticsId;
  monitoring: MonitoringId;
  storage: StorageId;
  search: ManagedSearchId;
  featureFlags: FeatureFlagsId;
}

// ---- 10. Design ----
export type CssFrameworkId =
  | 'tailwind' | 'vanilla-css' | 'css-modules'
  | 'styled-components' | 'emotion' | 'panda-css'
  | 'vanilla-extract' | 'sass' | 'unocss' | 'open-props' | 'none';

export type ComponentLibraryId =
  | 'shadcn-ui' | 'radix-ui' | 'headless-ui' | 'mantine'
  | 'chakra-ui' | 'mui' | 'ant-design' | 'nextui' | 'heroui'
  | 'daisyui' | 'flowbite' | 'park-ui' | 'none';

export type IconSetId =
  | 'lucide' | 'heroicons' | 'tabler' | 'phosphor'
  | 'feather' | 'fontawesome' | 'material-icons' | 'none';

export type FontFamilyId =
  | 'inter' | 'roboto' | 'open-sans' | 'poppins'
  | 'cairo' | 'tajawal' | 'almarai' | 'ibm-plex-sans-arabic'
  | 'noto-sans' | 'system-default';

export interface DesignSystem {
  cssFramework: CssFrameworkId;
  componentLibrary: ComponentLibraryId;
  iconSet: IconSetId;
  fontFamily: FontFamilyId;
  designTokens: boolean;
}

// ---- 11. i18n ----
export interface I18nStack {
  enabled: boolean;
  defaultLocale: LocaleId;
  supportedLocales: LocaleId[];
  rtlSupport: boolean;
  translationSource: TranslationSourceId;
}

export type TranslationSourceId =
  | 'local-json' | 'crowdin' | 'lokalise' | 'phrase'
  | 'transifex' | 'i18next-cms' | 'tolgee' | 'in-house-cms';

// ---- 12. Testing ----
export type UnitTestId =
  | 'vitest' | 'jest' | 'mocha' | 'pytest' | 'junit'
  | 'go-test' | 'cargo-test' | 'rspec' | 'phpunit' | 'xunit' | 'none';

export type ComponentTestId =
  | 'react-testing-library' | 'vue-test-utils'
  | 'cypress-component' | 'storybook-tests' | 'none';

export type E2eTestId =
  | 'playwright' | 'cypress' | 'puppeteer'
  | 'webdriver-io' | 'detox' | 'maestro' | 'none';

export type ApiTestId =
  | 'supertest' | 'postman-newman' | 'insomnia'
  | 'httpie' | 'rest-assured' | 'tavern' | 'none';

export interface TestingStack {
  unit: UnitTestId;
  component: ComponentTestId;
  e2e: E2eTestId;
  api: ApiTestId;
  visualRegression: boolean;
  loadTesting: boolean;
  securityScanning: boolean;
  coverageTarget: number;
}

// ---- 13. CI/CD ----
export type CiId =
  | 'github-actions' | 'gitlab-ci' | 'circleci' | 'jenkins'
  | 'buildkite' | 'azure-pipelines' | 'bitbucket-pipelines'
  | 'drone' | 'travis-ci' | 'none';

export type CdId =
  | 'vercel-deploy' | 'netlify-deploy' | 'aws-codedeploy'
  | 'gcp-cloud-deploy' | 'argocd' | 'fluxcd'
  | 'spinnaker' | 'manual-ssh';

export type IacId =
  | 'terraform' | 'pulumi' | 'cdk' | 'ansible'
  | 'cloudformation' | 'opentofu' | 'none';

export type PackageManagerId =
  | 'npm' | 'pnpm' | 'yarn' | 'bun'
  | 'pip' | 'poetry' | 'uv'
  | 'maven' | 'gradle' | 'cargo' | 'go-modules'
  | 'bundler' | 'composer';

export type MonorepoId =
  | 'turborepo' | 'nx' | 'rush' | 'pnpm-workspaces'
  | 'yarn-workspaces' | 'bazel' | 'lerna' | 'none';

export interface DevOpsStack {
  ci: CiId;
  cd: CdId;
  iac: IacId;
  packageManager: PackageManagerId;
  monorepo: MonorepoId;
}

// ---- 14. Professional Requirements ----
export interface ProfessionalRequirements {
  userAccounts: boolean;
  sensitiveData: boolean;
  adminPanel: boolean;
  mobileResponsive: boolean;
  realTimeFeatures: boolean;
  fileUploads: boolean;
  payments: boolean;
  searchFeature: boolean;
  analytics: boolean;
  multiLanguage: boolean;
}

// ---- Master shape ----
export interface ProjectData {
  identity: ProjectIdentity;
  language: LanguageId | '';
  coreFeatures: string[];
  stack: {
    frontend: FrontendId | '';
    backend: BackendId | '';
    database: DatabaseStack;
    hosting: HostingStack;
    auth: AuthStack;
    design: DesignSystem;
    i18n: I18nStack;
    thirdParty: ThirdPartyStack;
    testing: TestingStack;
    devops: DevOpsStack;
  };
  professionalRequirements: ProfessionalRequirements;
  additionalRequirements: string[];
}

export type UiLocale = 'ar' | 'en';
export type WizardStepId =
  | 'welcome' | 'project-type' | 'identity' | 'features' | 'professional'
  | 'language' | 'frontend' | 'backend' | 'database'
  | 'hosting' | 'auth' | 'design' | 'i18n' | 'third-party'
  | 'testing' | 'devops' | 'additional' | 'generate';