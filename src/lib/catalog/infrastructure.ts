import type { CatalogEntry } from './types';
import type {
  DatabasePrimaryId, CacheId, VectorId, SearchId, AnalyticsDbId,
  GraphId, TimeSeriesId, FrontendHostingId, BackendHostingId,
  DatabaseHostingId, CdnId, OrchestrationId, AuthProviderId,
  SocialProviderId, PaymentId, EmailId, SmsId, AnalyticsId,
  MonitoringId, StorageId, ManagedSearchId, FeatureFlagsId,
} from '@/types';

const compact = <T extends string>(id: T, name: string, nameAr: string, cat: string, catAr: string, desc: string, descAr: string, pros: string[], bestFor: string[], version: string, difficulty: 'beginner' | 'intermediate' | 'advanced', icon: string): CatalogEntry<T> => ({ id, name, nameAr, category: cat, categoryAr: catAr, description: desc, descriptionAr: descAr, pros, bestFor, version, difficulty, icon });

// ============== DATABASES ==============
export const primaryDatabases: CatalogEntry<DatabasePrimaryId>[] = [
  compact('postgresql', 'PostgreSQL', 'بوستجريس', 'Relational', 'علاقي', 'Powerful object-relational DB.', 'قاعدة علاقية قوية.', ['ACID', 'JSON'], ['Web apps'], '^16.0', 'intermediate', 'Database'),
  compact('mysql', 'MySQL', 'ماي إس كيو إل', 'Relational', 'علاقي', "World's most popular.", 'الأكثر شعبية.', ['Mature'], ['Web apps'], '^8.4.0', 'beginner', 'Database'),
  compact('mongodb', 'MongoDB', 'مونجو', 'Document', 'مستندي', 'Document-oriented NoSQL.', 'NoSQL مستندي.', ['Flexible schema'], ['Rapid iteration'], '^7.0', 'intermediate', 'Database'),
  compact('sqlite', 'SQLite', 'إس كيو لايت', 'Embedded', 'مضمّن', 'Embedded SQL.', 'SQL مضمّن.', ['Zero config'], ['Local-first'], '^3.46.0', 'beginner', 'Database'),
  compact('firestore', 'Firestore', 'فايرستور', 'Managed Document', 'مستندي مدار', "Google's serverless NoSQL.", 'مستندي بدون خادم من جوجل.', ['Real-time'], ['Mobile'], 'Firebase managed', 'beginner', 'Database'),
  compact('supabase-db', 'Supabase Postgres', 'سوبابيز', 'Managed Postgres', 'بوستجرس مدار', 'Postgres + auth + storage + realtime.', 'بوستجرس + مصادقة + تخزين.', ['All-in-one', 'RLS'], ['Full-stack'], 'Managed', 'beginner', 'Database'),
  compact('neon', 'Neon', 'نيون', 'Serverless Postgres', 'بوستجرس بدون خادم', 'Serverless Postgres with branching.', 'بوستجرس بدون خادم مع تفرّع.', ['Branching', 'Autoscaling'], ['Modern Postgres'], 'Managed', 'intermediate', 'Database'),
  compact('planetscale', 'PlanetScale', 'بلانت سكيل', 'Managed MySQL', 'MySQL مدار', 'Serverless MySQL with branching.', 'MySQL بدون خادم.', ['Branching'], ['MySQL on cloud'], 'Managed', 'intermediate', 'Database'),
  compact('dynamodb', 'DynamoDB', 'داينامو', 'Managed NoSQL', 'NoSQL مدار', 'AWS managed key-value.', 'مفتاح-قيمة مُدار.', ['Serverless'], ['AWS workloads'], 'AWS managed', 'intermediate', 'Database'),
  compact('cosmosdb', 'Cosmos DB', 'كوزموس', 'Managed NoSQL', 'NoSQL مدار', 'Microsoft globally distributed.', 'موزعة عالميًا من مايكروسوفت.', ['Multi-model'], ['Global Azure'], 'Azure managed', 'advanced', 'Database'),
  compact('mariadb', 'MariaDB', 'ماريا دي بي', 'Relational', 'علاقي', 'MySQL fork.', 'شوكة MySQL.', ['Drop-in'], ['MySQL replacements'], '^11.4.0', 'intermediate', 'Database'),
  compact('couchdb', 'CouchDB', 'كاوتش', 'Document', 'مستندي', 'Document DB with HTTP.', 'مستندي مع HTTP.', ['Offline-first'], ['Sync apps'], '^3.4.0', 'intermediate', 'Database'),
  compact('cassandra', 'Cassandra', 'كاساندرا', 'Wide-column', 'عمود عريض', 'Distributed wide-column.', 'عمود عريض موزع.', ['Linear scaling'], ['IoT'], '^5.0', 'advanced', 'Database'),
  compact('tidb', 'TiDB', 'تي آي دي بي', 'Distributed SQL', 'SQL موزع', 'Distributed MySQL-compatible.', 'MySQL موزع.', ['HTAP'], ['MySQL at scale'], '^8.5.0', 'advanced', 'Database'),
  compact('cockroachdb', 'CockroachDB', 'كوكروش', 'Distributed SQL', 'SQL موزع', 'Distributed SQL.', 'SQL موزع.', ['Survives regions'], ['Global apps'], '^24.2.0', 'advanced', 'Database'),
  compact('none', 'No Primary DB', 'بدون قاعدة', 'None', 'بدون', 'No database.', 'بدون.', ['Simpler'], ['Stateless'], '—', 'beginner', 'Minus'),
];

export const cacheDatabases: CatalogEntry<CacheId>[] = [
  compact('redis', 'Redis', 'ريديس', 'In-memory', 'في الذاكرة', 'In-memory data store.', 'مخزن في الذاكرة.', ['Rich types'], ['Cache', 'Sessions'], '^7.4', 'intermediate', 'Zap'),
  compact('memcached', 'Memcached', 'ميم كاشد', 'In-memory', 'في الذاكرة', 'Distributed memory cache.', 'كاش موزع في الذاكرة.', ['Simple'], ['Caching'], '^1.6.0', 'beginner', 'Zap'),
  compact('keydb', 'KeyDB', 'كي دي بي', 'In-memory', 'في الذاكرة', 'Redis-compatible multi-threaded.', 'ريديس متعدد الخيوط.', ['Faster than Redis'], ['Drop-in'], '^6.3.4', 'intermediate', 'Zap'),
  compact('dragonfly', 'Dragonfly', 'دراجون فلاي', 'In-memory', 'في الذاكرة', 'Modern Redis-compatible.', 'ريديس حديث.', ['Multi-threaded'], ['Drop-in'], '^1.13.0', 'intermediate', 'Zap'),
  compact('upstash-redis', 'Upstash Redis', 'أب ستاش', 'Serverless', 'بدون خادم', 'Serverless Redis with HTTP.', 'ريديس بدون خادم.', ['Per-request'], ['Edge'], 'Managed', 'beginner', 'Zap'),
  compact('none', 'No Cache', 'بدون كاش', 'None', 'بدون', 'No cache layer.', 'بدون.', ['Simpler'], ['Tiny apps'], '—', 'beginner', 'Minus'),
];

export const vectorDatabases: CatalogEntry<VectorId>[] = [
  compact('pgvector', 'pgvector', 'pgvector', 'Postgres', 'داخل Postgres', 'Postgres vector extension.', 'إضافة متجهات لـ Postgres.', ['No new DB'], ['RAG'], '^0.7.0', 'intermediate', 'Brain'),
  compact('pinecone', 'Pinecone', 'باين كون', 'Managed', 'مدار', 'Managed vector DB.', 'مدار.', ['Easy'], ['RAG'], 'Managed', 'beginner', 'Brain'),
  compact('weaviate', 'Weaviate', 'ويافيات', 'OSS', 'مفتوح المصدر', 'Hybrid search.', 'بحث هجين.', ['Modules'], ['Semantic + keyword'], '^1.27.0', 'intermediate', 'Brain'),
  compact('chroma', 'Chroma', 'كروما', 'OSS', 'مفتوح المصدر', 'AI-native embedding DB.', 'تضمين AI.', ['Pythonic'], ['Prototyping'], '^0.5.0', 'beginner', 'Brain'),
  compact('qdrant', 'Qdrant', 'كيو درانت', 'OSS (Rust)', 'رست', 'Rust-powered vector DB.', 'متجهات بـ Rust.', ['Fast'], ['Production RAG'], '^1.10.0', 'intermediate', 'Brain'),
  compact('milvus', 'Milvus', 'ميلفوس', 'OSS', 'مفتوح المصدر', 'Distributed vector DB.', 'متجهات موزعة.', ['Billions scale'], ['Enterprise AI'], '^2.4.0', 'advanced', 'Brain'),
  compact('lancedb', 'LanceDB', 'لانس دي بي', 'Embedded', 'مضمّن', 'Embedded vector (columnar).', 'متجهات مضمّنة.', ['Serverless'], ['Serverless AI'], '^0.8.0', 'intermediate', 'Brain'),
  compact('turbopuffer', 'Turbopuffer', 'تيربو بافر', 'Serverless', 'بدون خادم', 'Serverless vector on object storage.', 'متجهات بدون خادم.', ['Cheap'], ['Cost-sensitive'], 'Managed', 'intermediate', 'Brain'),
  compact('none', 'No Vector DB', 'بدون متجهات', 'None', 'بدون', 'No embeddings needed.', 'لا حاجة للتضمين.', ['Simpler'], ['Non-AI'], '—', 'beginner', 'Minus'),
];

export const searchDatabases: CatalogEntry<SearchId>[] = [
  compact('meilisearch', 'Meilisearch', 'مايلي سيرش', 'Lightweight', 'خفيف', 'Lightning-fast.', 'سريع جدًا.', ['Typo-tolerant'], ['In-app search'], '^1.10.0', 'beginner', 'Search'),
  compact('typesense', 'Typesense', 'تايب سينس', 'Lightweight', 'خفيف', 'Open-source typo-tolerant.', 'مفتوح المصدر.', ['Geo search'], ['E-commerce'], '^27.0', 'beginner', 'Search'),
  compact('elasticsearch', 'Elasticsearch', 'إلاستك', 'Full-text + Analytics', 'نص كامل', 'Distributed search + analytics.', 'بحث وتحليلات.', ['Powerful'], ['Log search'], '^8.15.0', 'advanced', 'Search'),
  compact('opensearch', 'OpenSearch', 'أوبن سيرش', 'Full-text + Analytics', 'نص كامل', 'Open-source Elasticsearch fork.', 'شوكة إلاستك.', ['Open source'], ['AWS search'], '^2.15.0', 'advanced', 'Search'),
  compact('algolia', 'Algolia', 'ألغوليا', 'Managed', 'مدار', 'Search-as-a-service.', 'بحث كخدمة.', ['Best UX'], ['E-commerce'], 'Managed', 'beginner', 'Search'),
  compact('orama', 'Orama', 'أوراما', 'In-memory', 'في الذاكرة', 'In-memory full-text + vector.', 'بحث في الذاكرة.', ['Zero server'], ['Client-side'], '^3.0.0', 'beginner', 'Search'),
  compact('none', 'No Search', 'بدون بحث', 'None', 'بدون', 'No search engine.', 'بدون.', ['Simpler'], ['Small datasets'], '—', 'beginner', 'Minus'),
];

export const analyticsDatabases: CatalogEntry<AnalyticsDbId>[] = [
  compact('clickhouse', 'ClickHouse', 'كليك هاوس', 'OLAP', 'OLAP', 'Columnar analytics.', 'تحليلات عمودية.', ['Extremely fast'], ['Events'], '^24.8', 'intermediate', 'BarChart3'),
  compact('duckdb', 'DuckDB', 'دك دي بي', 'Embedded OLAP', 'OLAP مضمّن', 'In-process analytical.', 'تحليلية مضمّنة.', ['Pandas'], ['Data science'], '^1.1.0', 'beginner', 'BarChart3'),
  compact('snowflake', 'Snowflake', 'سنو فليك', 'Cloud DW', 'مستودع سحابي', 'Cloud data warehouse.', 'مستودع بيانات سحابي.', ['Scales instantly'], ['Enterprise BI'], 'Managed', 'intermediate', 'BarChart3'),
  compact('bigquery', 'BigQuery', 'بيج كويري', 'Cloud DW', 'مستودع سحابي', "Google's serverless DW.", 'مستودع جوجل.', ['Serverless'], ['GCP analytics'], 'Managed', 'intermediate', 'BarChart3'),
  compact('redshift', 'Redshift', 'ريد شيفت', 'Cloud DW', 'مستودع سحابي', "AWS columnar DW.", 'مستودع AWS.', ['Mature'], ['AWS analytics'], 'Managed', 'intermediate', 'BarChart3'),
  compact('none', 'No Analytics DB', 'بدون تحليلات', 'None', 'بدون', 'No OLAP.', 'بدون.', ['Simpler'], ['Simple apps'], '—', 'beginner', 'Minus'),
];

export const graphDatabases: CatalogEntry<GraphId>[] = [
  compact('neo4j', 'Neo4j', 'نيو 4 جي', 'Property Graph', 'رسم بياني', 'Native graph DB.', 'قاعدة بيانات رسوم بيانية أصلية.', ['Cypher'], ['Social graphs'], '^5.23.0', 'intermediate', 'Network'),
  compact('arangodb', 'ArangoDB', 'أرانغو', 'Multi-model', 'متعدد النماذج', 'Multi-model with graph.', 'متعدد النماذج.', ['AQL'], ['Mixed workloads'], '^3.12.0', 'intermediate', 'Network'),
  compact('tigergraph', 'TigerGraph', 'تايجر', 'Distributed', 'موزع', 'Enterprise graph.', 'مؤسساتي.', ['Parallel'], ['Fraud detection'], 'Managed', 'advanced', 'Network'),
  compact('neptune', 'Neptune', 'نبتون', 'Managed', 'مدار', 'AWS managed graph.', 'مدار من AWS.', ['Gremlin'], ['AWS'], 'Managed', 'intermediate', 'Network'),
  compact('dgraph', 'Dgraph', 'دي غراف', 'GraphQL-native', 'GraphQL أصلي', 'Graph database with GraphQL.', 'GraphQL أصلي.', ['GraphQL first'], ['GraphQL backends'], '^23.0', 'intermediate', 'Network'),
  compact('none', 'No Graph DB', 'بدون بيانية', 'None', 'بدون', 'No graph.', 'بدون.', ['Simpler'], ['Simple data'], '—', 'beginner', 'Minus'),
];

export const timeSeriesDatabases: CatalogEntry<TimeSeriesId>[] = [
  compact('timescaledb', 'TimescaleDB', 'تايم سكيل', 'Postgres extension', 'إضافة Postgres', 'Postgres time-series.', 'سلاسل زمنية لـ Postgres.', ['Continuous agg.'], ['IoT', 'Metrics'], '^2.16.0', 'intermediate', 'Activity'),
  compact('influxdb', 'InfluxDB', 'إنفلوكس', 'Native TS', 'أصلي', 'Purpose-built TS.', 'مخصص للسلاسل.', ['Fast ingest'], ['Monitoring'], '^2.7', 'intermediate', 'Activity'),
  compact('questdb', 'QuestDB', 'كويست', 'Native TS', 'أصلي', 'Fast SQL TS.', 'سلاسل زمنية سريعة بـ SQL.', ['Very fast'], ['Tick data'], '^8.0', 'intermediate', 'Activity'),
  compact('prometheus', 'Prometheus', 'بروميثيوس', 'Monitoring TS', 'مراقبة', 'Monitoring-focused.', 'يركّز على المراقبة.', ['Pull-based'], ['Monitoring'], '^2.54.0', 'intermediate', 'Activity'),
  compact('victoria-metrics', 'VictoriaMetrics', 'فيكتوريا', 'Monitoring TS', 'مراقبة', 'Fast Prometheus alternative.', 'بديل سريع.', ['High compression'], ['Large-scale'], '^1.97.0', 'advanced', 'Activity'),
  compact('none', 'No TS DB', 'بدون سلاسل', 'None', 'بدون', 'No time-series.', 'بدون.', ['Simpler'], ['Non-IoT'], '—', 'beginner', 'Minus'),
];

// ============== HOSTING ==============
export const frontendHostingCatalog: CatalogEntry<FrontendHostingId>[] = [
  compact('vercel', 'Vercel', 'فيرسيل', 'Edge + Serverless', 'حافة', 'Frontend cloud.', 'سحابة الواجهات.', ['Instant deploys'], ['Next.js'], 'Managed', 'beginner', 'Triangle'),
  compact('netlify', 'Netlify', 'نتلايفي', 'Edge + Serverless', 'حافة', 'All-in-one platform.', 'منصة شاملة.', ['Forms'], ['Jamstack'], 'Managed', 'beginner', 'Triangle'),
  compact('cloudflare-pages', 'Cloudflare Pages', 'كلاودفلير بيجز', 'Edge', 'حافة', 'Static + Jamstack on Cloudflare.', 'ثابت على كلاودفلير.', ['Global CDN'], ['Static'], 'Managed', 'beginner', 'Cloud'),
  compact('aws-amplify', 'AWS Amplify', 'أمبليفاي', 'AWS', 'AWS', 'AWS-managed frontend.', 'إدارة AWS.', ['AWS integration'], ['AWS apps'], 'Managed', 'intermediate', 'Cloud'),
  compact('firebase-hosting', 'Firebase Hosting', 'فايربيز', 'Firebase', 'فايربيز', 'Fast hosting.', 'استضافة سريعة.', ['Free SSL'], ['Firebase apps'], 'Managed', 'beginner', 'Flame'),
  compact('azure-static-web-apps', 'Azure Static Web Apps', 'أزور', 'Azure', 'أزور', 'Azure static + serverless.', 'أزور ثابت.', ['GitHub'], ['Azure'], 'Managed', 'intermediate', 'Cloud'),
  compact('github-pages', 'GitHub Pages', 'جيتهب بيجز', 'Static', 'ثابت', 'Free static.', 'ثابت مجاني.', ['Free'], ['Docs'], 'Free', 'beginner', 'Github'),
  compact('render-static', 'Render Static', 'ريندر', 'PaaS', 'PaaS', 'Render static.', 'ريندر ثابت.', ['PR previews'], ['Static'], 'Managed', 'beginner', 'Triangle'),
  compact('self-hosted-nginx', 'Self-hosted (Nginx)', 'ذاتي (Nginx)', 'Self', 'ذاتي', 'Your own VPS.', 'VPS خاص.', ['Full control'], ['Custom'], '—', 'advanced', 'Server'),
  compact('none', 'No Frontend Hosting', 'بدون', 'None', 'بدون', 'No frontend to host.', 'بدون.', ['Simpler'], ['API-only'], '—', 'beginner', 'Minus'),
];

export const backendHostingCatalog: CatalogEntry<BackendHostingId>[] = [
  compact('vercel-functions', 'Vercel Functions', 'فيرسيل فنكشنز', 'Serverless', 'بدون خادم', 'Vercel serverless.', 'دوال فيرسيل.', ['Auto-scaling'], ['Next.js'], 'Managed', 'beginner', 'Triangle'),
  compact('netlify-functions', 'Netlify Functions', 'نتلايفي', 'Serverless', 'بدون خادم', 'AWS Lambda-backed.', 'دوال نتلايفي.', ['Background'], ['Jamstack'], 'Managed', 'beginner', 'Triangle'),
  compact('cloudflare-workers', 'Cloudflare Workers', 'ووركرز', 'Edge', 'حافة', 'V8 isolates at edge.', 'V8 على الحافة.', ['Sub-ms cold start'], ['Edge APIs'], 'Managed', 'intermediate', 'Cloud'),
  compact('aws-lambda', 'AWS Lambda', 'لامبدا', 'AWS', 'AWS', 'Function-as-a-Service.', 'دوال AWS.', ['Mature'], ['Event-driven'], 'Managed', 'intermediate', 'Cloud'),
  compact('aws-ecs', 'AWS ECS', 'إي سي إس', 'AWS Containers', 'حاويات AWS', 'Managed Docker.', 'حاويات AWS.', ['Fargate'], ['Microservices'], 'Managed', 'advanced', 'Cloud'),
  compact('aws-fargate', 'AWS Fargate', 'فارغيت', 'AWS Serverless Containers', 'حاويات AWS بدون خادم', 'Serverless containers.', 'حاويات بدون خادم.', ['No EC2'], ['Containers'], 'Managed', 'advanced', 'Cloud'),
  compact('aws-ec2', 'AWS EC2', 'إي سي 2', 'AWS VMs', 'AWS VMs', 'Virtual machines.', 'أجهزة افتراضية.', ['Full control'], ['Custom'], 'Managed', 'advanced', 'Cloud'),
  compact('gcp-cloud-run', 'GCP Cloud Run', 'كلاود رن', 'GCP Serverless', 'GCP بدون خادم', 'Run containers on GCP.', 'حاويات GCP.', ['Scales to zero'], ['Containers'], 'Managed', 'intermediate', 'Cloud'),
  compact('gcp-app-engine', 'GCP App Engine', 'آب إنجن', 'GCP PaaS', 'GCP PaaS', 'Google PaaS.', 'منصة جوجل.', ['Simple'], ['APIs'], 'Managed', 'intermediate', 'Cloud'),
  compact('azure-app-service', 'Azure App Service', 'أزور آب سيرفيس', 'Azure PaaS', 'أزور PaaS', 'Azure PaaS.', 'منصة أزور.', ['Easy'], ['Web apps'], 'Managed', 'intermediate', 'Cloud'),
  compact('azure-container-apps', 'Azure Container Apps', 'أزور كونتينر', 'Azure Containers', 'حاويات أزور', 'Serverless containers.', 'حاويات بدون خادم.', ['Microservices'], ['Azure'], 'Managed', 'advanced', 'Cloud'),
  compact('railway', 'Railway', 'ريل واي', 'PaaS', 'PaaS', 'Simple PaaS.', 'منصة بسيطة.', ['Easy'], ['MVPs'], 'Managed', 'beginner', 'Train'),
  compact('render', 'Render', 'ريندر', 'PaaS', 'PaaS', 'Unified cloud.', 'سحابة موحدة.', ['Free tier'], ['Web'], 'Managed', 'beginner', 'Triangle'),
  compact('fly-io', 'Fly.io', 'فلاي آي أو', 'Edge PaaS', 'PaaS حافة', 'Close to users.', 'قريبة من المستخدمين.', ['Edge regions'], ['Distributed'], 'Managed', 'intermediate', 'Plane'),
  compact('digitalocean-app', 'DigitalOcean App', 'ديجيتال أوشن', 'PaaS', 'PaaS', 'DigitalOcean PaaS.', 'منصة ديجيتال أوشن.', ['Predictable'], ['SMEs'], 'Managed', 'beginner', 'Cloud'),
  compact('heroku', 'Heroku', 'هيروكو', 'PaaS', 'PaaS', 'Classic PaaS.', 'كلاسيكية.', ['Add-ons'], ['Quick'], 'Managed', 'beginner', 'Triangle'),
  compact('docker-self-hosted', 'Docker (Self-hosted)', 'دوكر ذاتي', 'Self', 'ذاتي', 'Run Docker.', 'تشغيل دوكر.', ['Full control'], ['Custom'], '—', 'advanced', 'Container'),
  compact('kubernetes-self-hosted', 'Kubernetes (Self-hosted)', 'كوبرنيتس ذاتي', 'Self', 'ذاتي', 'Run K8s.', 'تشغيل K8s.', ['Max control'], ['On-prem'], '—', 'advanced', 'Boxes'),
  compact('none', 'No Backend Hosting', 'بدون', 'None', 'بدون', 'No backend.', 'بدون.', ['Simpler'], ['Frontend-only'], '—', 'beginner', 'Minus'),
];

export const databaseHostingCatalog: CatalogEntry<DatabaseHostingId>[] = [
  compact('supabase', 'Supabase', 'سوبابيز', 'Managed', 'مدار', 'Postgres + auth + storage.', 'بوستجرس + خدمات.', ['All-in-one'], ['Full-stack'], 'Managed', 'beginner', 'Database'),
  compact('neon', 'Neon', 'نيون', 'Serverless', 'بدون خادم', 'Serverless Postgres.', 'بوستجرس بدون خادم.', ['Branching'], ['Modern'], 'Managed', 'intermediate', 'Database'),
  compact('planetscale', 'PlanetScale', 'بلانت سكيل', 'Managed', 'مدار', 'Serverless MySQL.', 'MySQL بدون خادم.', ['Branching'], ['MySQL'], 'Managed', 'intermediate', 'Database'),
  compact('railway-db', 'Railway DB', 'ريل واي', 'PaaS', 'PaaS', 'Postgres/MySQL/Redis on Railway.', 'خدمات Railway.', ['Easy'], ['Railway apps'], 'Managed', 'beginner', 'Database'),
  compact('render-postgres', 'Render Postgres', 'ريندر', 'PaaS', 'PaaS', 'Render Postgres.', 'بوستجرس ريندر.', ['Free tier'], ['Render apps'], 'Managed', 'beginner', 'Database'),
  compact('aws-rds', 'AWS RDS', 'آر دي إس', 'AWS', 'AWS', 'Managed relational.', 'علاقي مدار.', ['Mature'], ['Production'], 'Managed', 'advanced', 'Cloud'),
  compact('aws-aurora', 'AWS Aurora', 'أورورا', 'AWS', 'AWS', 'Cloud-native distributed.', 'سحابية موزعة.', ['Performance'], ['High-traffic'], 'Managed', 'advanced', 'Cloud'),
  compact('gcp-cloud-sql', 'GCP Cloud SQL', 'كلاود إس كيو إل', 'GCP', 'GCP', 'Managed SQL on GCP.', 'SQL مدار.', ['HA'], ['GCP apps'], 'Managed', 'intermediate', 'Cloud'),
  compact('azure-cosmos', 'Azure Cosmos DB', 'كوزموس', 'Azure', 'أزور', 'Globally distributed.', 'موزعة عالميًا.', ['Multi-model'], ['Global Azure'], 'Managed', 'advanced', 'Cloud'),
  compact('mongodb-atlas', 'MongoDB Atlas', 'أطلس', 'Managed', 'مدار', 'Managed MongoDB.', 'مونجو مدار.', ['Multi-cloud'], ['MongoDB users'], 'Managed', 'intermediate', 'Database'),
  compact('upstash', 'Upstash', 'أب ستاش', 'Serverless', 'بدون خادم', 'Serverless Redis + Kafka.', 'ريديس وكافكا.', ['Per-request'], ['Edge KV'], 'Managed', 'beginner', 'Zap'),
  compact('turso', 'Turso', 'تورسو', 'Edge SQLite', 'SQLite حافة', 'Distributed SQLite (libSQL).', 'SQLite موزع.', ['Edge replicas'], ['Edge apps'], 'Managed', 'intermediate', 'Database'),
  compact('self-hosted-docker', 'Self-hosted (Docker)', 'ذاتي (Docker)', 'Self', 'ذاتي', 'Run any DB.', 'أي قاعدة بيانات.', ['Full control'], ['Custom'], '—', 'advanced', 'Container'),
  compact('none', 'No DB Hosting', 'بدون', 'None', 'بدون', 'No database.', 'بدون.', ['Simpler'], ['Stateless'], '—', 'beginner', 'Minus'),
];

export const cdnsCatalog: CatalogEntry<CdnId>[] = [
  compact('cloudflare', 'Cloudflare CDN', 'كلاودفلير', 'Global', 'عالمي', 'Massive edge network.', 'شبكة ضخمة.', ['Free tier'], ['Most apps'], 'Managed', 'beginner', 'Cloud'),
  compact('cloudfront', 'AWS CloudFront', 'كلاود فرونت', 'AWS', 'AWS CDN', 'AWS CDN.', 'CDN لـ AWS.', ['AWS'], ['AWS'], 'Managed', 'intermediate', 'Cloud'),
  compact('fastly', 'Fastly', 'فاستلي', 'Edge', 'حافة', 'Programmable edge.', 'CDN قابل للبرمجة.', ['Edge compute'], ['Edge'], 'Managed', 'advanced', 'Zap'),
  compact('bunny-cdn', 'Bunny CDN', 'باني', 'Affordable', 'اقتصادي', 'Cheap CDN.', 'رخيص وسريع.', ['Cheap'], ['Budget'], 'Managed', 'beginner', 'Cloud'),
  compact('akamai', 'Akamai', 'أكاماي', 'Enterprise', 'مؤسساتي', 'Largest CDN.', 'أكبر CDN.', ['Enterprise'], ['Large'], 'Managed', 'advanced', 'Cloud'),
  compact('keycdn', 'KeyCDN', 'كي CDN', 'Affordable', 'اقتصادي', 'Affordable CDN.', 'اقتصادي.', ['Cheap'], ['Budget'], 'Managed', 'beginner', 'Cloud'),
  compact('none', 'No CDN', 'بدون CDN', 'None', 'بدون', 'No CDN.', 'بدون.', ['Simpler'], ['Tiny apps'], '—', 'beginner', 'Minus'),
];

export const orchestrationCatalog: CatalogEntry<OrchestrationId>[] = [
  compact('kubernetes', 'Kubernetes (managed)', 'كوبرنيتس', 'Orchestration', 'تنسيق', 'Industry-standard.', 'المعيار الصناعي.', ['Portable'], ['Large'], '^1.31.0', 'advanced', 'Boxes'),
  compact('docker-compose', 'Docker Compose', 'كومبوز', 'Orchestration', 'تنسيق', 'Multi-container.', 'متعدد الحاويات.', ['Simple'], ['Small'], 'v2.27.0', 'beginner', 'Container'),
  compact('docker-swarm', 'Docker Swarm', 'سوارم', 'Orchestration', 'تنسيق', 'Docker clustering.', 'تجميع دوكر.', ['Native'], ['Simple'], 'Built-in', 'intermediate', 'Container'),
  compact('nomad', 'HashiCorp Nomad', 'نوماد', 'Orchestration', 'تنسيق', 'Lightweight orchestrator.', 'منسّق خفيف.', ['Multi-runtime'], ['Mixed'], '^1.9.0', 'advanced', 'Boxes'),
  compact('ecs', 'AWS ECS', 'إي سي إس', 'AWS', 'AWS أصلي', "AWS's container service.", 'حاويات AWS.', ['AWS'], ['AWS shops'], 'Managed', 'intermediate', 'Cloud'),
  compact('gke', 'GCP GKE', 'جي كي إي', 'GCP Managed', 'GCP مدار', 'Managed K8s.', 'K8s مدار.', ['Auto-pilot'], ['GCP workloads'], 'Managed', 'advanced', 'Cloud'),
  compact('aks', 'Azure AKS', 'إيه كي إس', 'Azure Managed', 'Azure مدار', 'Managed K8s.', 'K8s مدار.', ['Azure'], ['Azure workloads'], 'Managed', 'advanced', 'Cloud'),
  compact('eks', 'AWS EKS', 'إي كي إس', 'AWS Managed K8s', 'AWS K8s مدار', 'Managed K8s on AWS.', 'K8s على AWS.', ['K8s + AWS'], ['AWS K8s'], 'Managed', 'advanced', 'Cloud'),
  compact('none', 'No Orchestration', 'بدون', 'None', 'بدون', 'No orchestration.', 'بدون.', ['Simpler'], ['Serverless'], '—', 'beginner', 'Minus'),
];