import type { CatalogEntry } from './types';
import type {
  AuthProviderId, SocialProviderId, PaymentId, EmailId, SmsId,
  AnalyticsId, MonitoringId, StorageId, ManagedSearchId, FeatureFlagsId,
  CssFrameworkId, ComponentLibraryId, IconSetId, FontFamilyId,
  TranslationSourceId, LocaleId, UnitTestId, ComponentTestId,
  E2eTestId, ApiTestId, CiId, CdId, IacId, PackageManagerId, MonorepoId,
} from '@/types';

const compact = <T extends string>(id: T, name: string, nameAr: string, cat: string, catAr: string, desc: string, descAr: string, pros: string[], bestFor: string[], version: string, difficulty: 'beginner' | 'intermediate' | 'advanced', icon: string): CatalogEntry<T> => ({ id, name, nameAr, category: cat, categoryAr: catAr, description: desc, descriptionAr: descAr, pros, bestFor, version, difficulty, icon });

// ============== AUTH ==============
export const authProviders: CatalogEntry<AuthProviderId>[] = [
  compact('supabase-auth', 'Supabase Auth', 'سوبابيز', 'BaaS', 'BaaS', 'Built into Supabase.', 'مدمج في Supabase.', ['RLS integration'], ['Supabase apps'], 'Managed', 'beginner', 'Shield'),
  compact('clerk', 'Clerk', 'كليرك', 'AaaS', 'AaaS', 'Modern auth with UI.', 'مصادقة حديثة.', ['Beautiful UI'], ['SaaS', 'B2B'], 'Managed', 'beginner', 'UserCheck'),
  compact('auth0', 'Auth0', 'أوث 0', 'AaaS', 'AaaS', 'Identity platform.', 'منصة هوية.', ['Universal Login'], ['Enterprise'], 'Managed', 'intermediate', 'Shield'),
  compact('firebase-auth', 'Firebase Auth', 'فايربيز', 'BaaS', 'BaaS', 'Google-managed.', 'من جوجل.', ['Free tier'], ['Firebase apps'], 'Managed', 'beginner', 'Shield'),
  compact('cognito', 'AWS Cognito', 'كوجنيتو', 'AWS', 'AWS', 'AWS user directory.', 'دليل AWS.', ['AWS integration'], ['AWS apps'], 'Managed', 'intermediate', 'Cloud'),
  compact('nextauth', 'NextAuth.js (Auth.js)', 'نيكست أوث', 'OSS', 'مفتوح المصدر', 'Auth for Next.js.', 'مصادقة لـ Next.js.', ['Open source'], ['Next.js apps'], '^5.0.0-beta.20', 'intermediate', 'Lock'),
  compact('lucia', 'Lucia', 'لوسيا', 'OSS', 'مفتوح المصدر', 'Lightweight session auth.', 'مصادقة خفيفة.', ['Simple'], ['Custom sessions'], '^3.2.0', 'intermediate', 'Key'),
  compact('better-auth', 'Better Auth', 'بيتر أوث', 'OSS', 'مفتوح المصدر', 'Modern framework-agnostic.', 'حديث.', ['Type-safe'], ['Modern stacks'], '^1.0.0', 'intermediate', 'Key'),
  compact('keycloak', 'Keycloak', 'كي كلاوك', 'Self-hosted IAM', 'ذاتي', 'Open-source IAM.', 'IAM مفتوح المصدر.', ['SAML/OIDC'], ['Enterprise SSO'], '^25.0.0', 'advanced', 'Shield'),
  compact('workos', 'WorkOS', 'وورك أو إس', 'B2B Auth', 'B2B', 'Enterprise SSO.', 'SSO مؤسساتي.', ['SAML', 'SCIM'], ['B2B apps'], 'Managed', 'intermediate', 'Briefcase'),
  compact('okta', 'Okta', 'أو كا تا', 'Enterprise IAM', 'مؤسساتي', 'Enterprise identity.', 'هوية مؤسساتية.', ['Enterprise'], ['Large enterprise'], 'Managed', 'advanced', 'Shield'),
  compact('custom-jwt', 'Custom JWT', 'مخصص JWT', 'Roll-your-own', 'ذاتي', 'Roll your own.', 'تنفيذ ذاتي.', ['Full control'], ['Custom'], '—', 'advanced', 'Code'),
  compact('custom-session', 'Custom Session', 'جلسات مخصصة', 'Roll-your-own', 'ذاتي', 'Server-side sessions.', 'جلسات الخادم.', ['Simple'], ['Traditional'], '—', 'advanced', 'Server'),
  compact('none', 'No Auth', 'بدون مصادقة', 'None', 'بدون', 'Public app.', 'تطبيق عام.', ['Simpler'], ['Public sites'], '—', 'beginner', 'Minus'),
];

export const socialProviders: CatalogEntry<SocialProviderId>[] = [
  compact('google', 'Google', 'جوجل', 'OAuth', 'OAuth', 'Sign in with Google.', 'تسجيل عبر جوجل.', ['Wide'], ['B2C'], 'OAuth 2.0', 'beginner', 'Chrome'),
  compact('github', 'GitHub', 'جيتهب', 'OAuth', 'OAuth', 'Sign in with GitHub.', 'تسجيل عبر GitHub.', ['Devs'], ['Dev tools'], 'OAuth 2.0', 'beginner', 'Github'),
  compact('apple', 'Apple', 'آبل', 'OAuth', 'OAuth', 'Sign in with Apple.', 'تسجيل عبر آبل.', ['Required for iOS'], ['iOS apps'], 'OAuth 2.0', 'intermediate', 'Apple'),
  compact('facebook', 'Facebook', 'فيسبوك', 'OAuth', 'OAuth', 'Sign in with Facebook.', 'تسجيل عبر فيسبوك.', ['Wide reach'], ['B2C'], 'OAuth 2.0', 'beginner', 'Facebook'),
  compact('microsoft', 'Microsoft', 'مايكروسوفت', 'OAuth', 'OAuth', 'Microsoft / Azure AD.', 'تسجيل عبر مايكروسوفت.', ['Enterprise'], ['B2B'], 'OAuth 2.0', 'intermediate', 'Cloud'),
  compact('twitter-x', 'X (Twitter)', 'إكس', 'OAuth', 'OAuth', 'Sign in with X.', 'تسجيل عبر X.', ['Public content'], ['Social'], 'OAuth 2.0', 'intermediate', 'Twitter'),
  compact('linkedin', 'LinkedIn', 'لينكدإن', 'OAuth', 'OAuth', 'Sign in with LinkedIn.', 'تسجيل عبر لينكدإن.', ['Professional'], ['B2B'], 'OAuth 2.0', 'intermediate', 'Linkedin'),
  compact('discord', 'Discord', 'ديسكورد', 'OAuth', 'OAuth', 'Sign in with Discord.', 'تسجيل عبر Discord.', ['Gamers'], ['Gaming'], 'OAuth 2.0', 'beginner', 'MessageCircle'),
  compact('gitlab', 'GitLab', 'جيtlاب', 'OAuth', 'OAuth', 'Sign in with GitLab.', 'تسجيل عبر GitLab.', ['Self-host'], ['Dev tools'], 'OAuth 2.0', 'beginner', 'GitBranch'),
  compact('bitbucket', 'Bitbucket', 'بت باكت', 'OAuth', 'OAuth', 'Sign in with Bitbucket.', 'تسجيل عبر Bitbucket.', ['Atlassian'], ['Atlassian'], 'OAuth 2.0', 'intermediate', 'GitBranch'),
];

// ============== THIRD PARTY ==============
export const paymentProviders: CatalogEntry<PaymentId>[] = [
  compact('stripe', 'Stripe', 'سترايب', 'Global', 'عالمي', "Developer's favorite.", 'API المدفوعات.', ['Best DX'], ['Most apps'], '^17.0.0', 'intermediate', 'CreditCard'),
  compact('paypal', 'PayPal', 'باي بال', 'Global', 'عالمي', 'Global payment network.', 'شبكة عالمية.', ['Trusted'], ['Consumer'], 'Managed', 'intermediate', 'CreditCard'),
  compact('paddle', 'Paddle', 'بادل', 'MoR', 'تاجر مسجّل', 'Merchant of record.', 'تاجر مسجّل.', ['Tax handled'], ['SaaS'], '^2.0.0', 'intermediate', 'CreditCard'),
  compact('lemonsqueezy', 'Lemon Squeezy', 'ليمون', 'MoR', 'تاجر مسجّل', 'Digital products MoR.', 'تاجر مسجّل رقمي.', ['Easy'], ['Digital'], 'Managed', 'beginner', 'CreditCard'),
  compact('razorpay', 'Razorpay', 'رازورباي', 'India/Asia', 'الهند', 'India/Asia leader.', 'الهند وآسيا.', ['UPI'], ['India apps'], 'Managed', 'intermediate', 'CreditCard'),
  compact('square', 'Square', 'سكوير', 'POS', 'نقطة بيع', 'In-person + online.', 'POS + أونلاين.', ['POS hardware'], ['Retail'], 'Managed', 'intermediate', 'CreditCard'),
  compact('adyen', 'Adyen', 'أدِين', 'Enterprise', 'مؤسساتي', 'Enterprise global.', 'مؤسساتي عالمي.', ['Unified API'], ['Enterprise'], 'Managed', 'advanced', 'CreditCard'),
  compact('mollie', 'Mollie', 'مولي', 'Europe', 'أوروبا', 'European payments.', 'مدفوعات أوروبية.', ['EU methods'], ['EU apps'], 'Managed', 'intermediate', 'CreditCard'),
  compact('checkoutcom', 'Checkout.com', 'تشيك أوت', 'Global', 'عالمي', 'Global processor.', 'معالج عالمي.', ['Performance'], ['Enterprise'], 'Managed', 'advanced', 'CreditCard'),
  compact('none', 'No Payments', 'بدون', 'None', 'بدون', 'No payments.', 'بدون.', ['Simpler'], ['Free apps'], '—', 'beginner', 'Minus'),
];

export const emailProviders: CatalogEntry<EmailId>[] = [
  compact('sendgrid', 'SendGrid', 'سيند قريد', 'Transactional', 'معاملي', 'Reliable transactional.', 'بريد معاملي.', ['Mature'], ['Transactional'], 'Managed', 'beginner', 'Mail'),
  compact('resend', 'Resend', 'ريسَند', 'Modern', 'حديث', 'Modern with React Email.', 'حديث.', ['DX'], ['Modern stacks'], '^4.0.0', 'beginner', 'Mail'),
  compact('postmark', 'Postmark', 'بوست', 'Transactional', 'معاملي', 'Fast transactional.', 'بريد معاملي سريع.', ['Reliable'], ['Transactional'], 'Managed', 'beginner', 'Mail'),
  compact('mailgun', 'Mailgun', 'ميل قَن', 'Transactional + Marketing', 'معاملي وتسويقي', 'Email API.', 'API بريد.', ['Programmable'], ['High-volume'], 'Managed', 'intermediate', 'Mail'),
  compact('amazon-ses', 'Amazon SES', 'إس إي إس', 'AWS', 'AWS', "AWS's email service.", 'بريد AWS.', ['Cheap'], ['AWS'], 'Managed', 'intermediate', 'Cloud'),
  compact('plunk', 'Plunk', 'بلانك', 'OSS', 'مفتوح المصدر', 'Open-source email.', 'بريد مفتوح المصدر.', ['Open source'], ['Self-host'], '^0.4.0', 'intermediate', 'Mail'),
  compact('loops', 'Loops', 'لووبس', 'Product', 'منتج', 'Product email SaaS.', 'بريد المنتج.', ['Behavior-based'], ['SaaS'], 'Managed', 'beginner', 'Mail'),
  compact('none', 'No Email', 'بدون بريد', 'None', 'بدون', 'No email.', 'بدون.', ['Simpler'], ['No email'], '—', 'beginner', 'Minus'),
];

export const smsProviders: CatalogEntry<SmsId>[] = [
  compact('twilio', 'Twilio', 'تويليو', 'Global', 'عالمي', 'Most popular SMS.', 'SMS الأشهر.', ['Reliable'], ['2FA'], 'Managed', 'intermediate', 'MessageSquare'),
  compact('messagebird', 'MessageBird', 'ميسِج بيرد', 'Global', 'عالمي', 'European leader.', 'رائد أوروبي.', ['EU channels'], ['EU'], 'Managed', 'intermediate', 'MessageSquare'),
  compact('vonage', 'Vonage', 'فونِج', 'Global', 'عالمي', 'Voice + SMS.', 'صوت + SMS.', ['Voice + SMS'], ['Both'], 'Managed', 'intermediate', 'MessageSquare'),
  compact('aws-sns', 'AWS SNS', 'إس إن إس', 'AWS', 'AWS', 'AWS pub/sub + SMS.', 'AWS pub/sub.', ['Cheap'], ['AWS'], 'Managed', 'intermediate', 'Cloud'),
  compact('plivo', 'Plivo', 'بليفو', 'Global', 'عالمي', 'Cloud communications.', 'اتصالات سحابية.', ['Simple'], ['SMS'], 'Managed', 'intermediate', 'MessageSquare'),
  compact('none', 'No SMS', 'بدون SMS', 'None', 'بدون', 'No SMS.', 'بدون.', ['Simpler'], ['No SMS'], '—', 'beginner', 'Minus'),
];

export const analyticsProviders: CatalogEntry<AnalyticsId>[] = [
  compact('google-analytics', 'Google Analytics 4', 'تحليلات جوجل 4', 'Web', 'ويب', 'Industry-standard.', 'معيار صناعي.', ['Free'], ['Marketing'], 'GA4', 'beginner', 'BarChart3'),
  compact('mixpanel', 'Mixpanel', 'ميكس بانِل', 'Product', 'منتج', 'Product analytics.', 'تحليلات المنتج.', ['Funnels'], ['Product teams'], 'Managed', 'intermediate', 'BarChart3'),
  compact('amplitude', 'Amplitude', 'أمبليتود', 'Product', 'منتج', 'Product intelligence.', 'ذكاء المنتج.', ['Behavior'], ['Product teams'], 'Managed', 'intermediate', 'BarChart3'),
  compact('posthog', 'PostHog', 'بوست هوغ', 'OSS', 'مفتوح المصدر', 'Open-source product OS.', 'نظام منتج مفتوح.', ['All-in-one'], ['Product teams'], '^1.0.0', 'intermediate', 'BarChart3'),
  compact('plausible', 'Plausible', 'بلاوسِبل', 'Privacy', 'خصوصية', 'Privacy-friendly.', 'يحترم الخصوصية.', ['No cookies'], ['Privacy'], 'Managed', 'beginner', 'BarChart3'),
  compact('fathom', 'Fathom', 'فاثوم', 'Privacy', 'خصوصية', 'Privacy-focused.', 'تحليلات الخصوصية.', ['GDPR'], ['Privacy'], 'Managed', 'beginner', 'BarChart3'),
  compact('umami', 'Umami', 'أومامي', 'OSS', 'مفتوح المصدر', 'Open-source web.', 'مفتوح المصدر.', ['Self-hostable'], ['Privacy'], '^2.10.0', 'intermediate', 'BarChart3'),
  compact('datadog-rum', 'Datadog RUM', 'داتادوغ', 'Enterprise', 'مؤسساتي', 'APM-integrated RUM.', 'مراقبة APM.', ['APM'], ['Enterprise'], 'Managed', 'advanced', 'BarChart3'),
  compact('sentry-replay', 'Sentry Replay', 'سينتري', 'Replay', 'إعادة', 'Session replay.', 'إعادة الجلسات.', ['Error correlation'], ['Debugging'], 'Managed', 'intermediate', 'BarChart3'),
  compact('none', 'No Analytics', 'بدون تحليلات', 'None', 'بدون', 'No analytics.', 'بدون.', ['Simpler'], ['Private'], '—', 'beginner', 'Minus'),
];

export const monitoringProviders: CatalogEntry<MonitoringId>[] = [
  compact('sentry', 'Sentry', 'سينتري', 'Errors', 'أخطاء', 'Errors + performance.', 'أخطاء + أداء.', ['Source maps'], ['Most apps'], '^8.0.0', 'beginner', 'AlertOctagon'),
  compact('datadog', 'Datadog', 'داتادوغ', 'Full APM', 'APM شامل', 'Full APM + infra + logs.', 'APM شامل.', ['All-in-one'], ['Enterprise'], 'Managed', 'advanced', 'Activity'),
  compact('new-relic', 'New Relic', 'نيو رِليك', 'Full APM', 'APM شامل', 'Full-stack observability.', 'مراقبة شاملة.', ['Mature'], ['Enterprise'], 'Managed', 'advanced', 'Activity'),
  compact('grafana-cloud', 'Grafana Cloud', 'قرافانا', 'OSS Observability', 'OSS', 'LGTM in cloud.', 'LGTM.', ['Open source'], ['OSS stacks'], 'Managed', 'intermediate', 'LineChart'),
  compact('honeybadger', 'Honeybadger', 'هاني بادجر', 'Errors', 'أخطاء', 'Error + uptime.', 'أخطاء + وقت تشغيل.', ['Simple'], ['SMB'], 'Managed', 'beginner', 'AlertOctagon'),
  compact('rollbar', 'Rollbar', 'رول بار', 'Errors', 'أخطاء', 'Real-time errors.', 'أخطاء فورية.', ['Real-time'], ['Production'], 'Managed', 'intermediate', 'AlertOctagon'),
  compact('axiom', 'Axiom', 'أكسِم', 'Logs', 'سجلات', 'Logs + events.', 'سجلات + أحداث.', ['Cheap'], ['Log-heavy'], 'Managed', 'intermediate', 'FileText'),
  compact('logflare', 'Logflare', 'لوغ فلير', 'Logs', 'سجلات', 'Cloud-native logging.', 'سجلات سحابية.', ['BigQuery'], ['GCP'], 'Managed', 'intermediate', 'FileText'),
  compact('none', 'No Monitoring', 'بدون مراقبة', 'None', 'بدون', 'No monitoring.', 'بدون.', ['Simpler'], ['Tiny apps'], '—', 'beginner', 'Minus'),
];

export const storageProviders: CatalogEntry<StorageId>[] = [
  compact('aws-s3', 'AWS S3', 'إس 3', 'Object', 'كائني', 'Industry standard.', 'معيار صناعي.', ['Durable'], ['All storage'], 'Managed', 'intermediate', 'HardDrive'),
  compact('cloudflare-r2', 'Cloudflare R2', 'آر 2', 'S3-compatible', 'متوافق S3', 'Zero egress fees.', 'بدون رسوم إخراج.', ['No egress'], ['High-traffic'], 'Managed', 'beginner', 'Cloud'),
  compact('backblaze-b2', 'Backblaze B2', 'بي 2', 'Affordable', 'اقتصادي', 'Very cheap S3-compatible.', 'اقتصادي جدًا.', ['Cheap'], ['Backups'], 'Managed', 'beginner', 'HardDrive'),
  compact('google-cloud-storage', 'Google Cloud Storage', 'تخزين جوجل', 'Object', 'كائني', 'Google object storage.', 'تخزين جوجل.', ['GCP'], ['GCP apps'], 'Managed', 'intermediate', 'Cloud'),
  compact('azure-blob', 'Azure Blob', 'أزور بلوب', 'Object', 'كائني', 'Microsoft object storage.', 'تخزين مايكروسوفت.', ['Azure'], ['Azure apps'], 'Managed', 'intermediate', 'Cloud'),
  compact('supabase-storage', 'Supabase Storage', 'سوبابيز', 'Integrated', 'مدمج', 'S3-compatible in Supabase.', 'متوافق S3 في Supabase.', ['RLS'], ['Supabase apps'], 'Managed', 'beginner', 'Database'),
  compact('uploadthing', 'UploadThing', 'أبلود ثينغ', 'File Uploads', 'رفع', 'Simple file uploads.', 'رفع ملفات بسيط.', ['Type-safe'], ['Next.js apps'], '^7.0.0', 'beginner', 'Upload'),
  compact('none', 'No File Storage', 'بدون تخزين', 'None', 'بدون', 'No file uploads.', 'بدون رفع ملفات.', ['Simpler'], ['No uploads'], '—', 'beginner', 'Minus'),
];

export const managedSearchProviders: CatalogEntry<ManagedSearchId>[] = [
  compact('algolia', 'Algolia', 'ألغوليا', 'Managed', 'مدار', 'Best-in-class.', 'الأفضل.', ['Best UX'], ['E-commerce'], 'Managed', 'beginner', 'Search'),
  compact('meilisearch-cloud', 'Meilisearch Cloud', 'مايلي كلاود', 'Managed OSS', 'مدار OSS', 'Managed Meilisearch.', 'Meilisearch مدار.', ['OSS'], ['Most'], 'Managed', 'beginner', 'Search'),
  compact('typesense-cloud', 'Typesense Cloud', 'تايب سينس كلاود', 'Managed OSS', 'مدار OSS', 'Managed Typesense.', 'Typesense مدار.', ['OSS'], ['Docs'], 'Managed', 'beginner', 'Search'),
  compact('elasticsearch-cloud', 'Elastic Cloud', 'إلاستك كلاود', 'Enterprise', 'مؤسساتي', 'Managed Elasticsearch.', 'Elasticsearch مدار.', ['Powerful'], ['Complex search'], 'Managed', 'advanced', 'Search'),
  compact('orama-cloud', 'Orama Cloud', 'أوراما كلاود', 'Edge', 'حافة', 'Search at edge.', 'بحث على الحافة.', ['Edge'], ['Edge apps'], 'Managed', 'beginner', 'Search'),
  compact('none', 'No Managed Search', 'بدون بحث مدار', 'None', 'بدون', 'No managed search.', 'بدون.', ['Simpler'], ['Tiny apps'], '—', 'beginner', 'Minus'),
];

export const featureFlagsProviders: CatalogEntry<FeatureFlagsId>[] = [
  compact('launchdarkly', 'LaunchDarkly', 'لانش داركلي', 'Enterprise', 'مؤسساتي', 'Enterprise feature flags.', 'أعلام مؤسساتية.', ['Powerful'], ['Enterprise'], 'Managed', 'intermediate', 'Flag'),
  compact('growthbook', 'GrowthBook', 'قروث بوك', 'OSS', 'مفتوح المصدر', 'OSS A/B + flags.', 'OSS أعلام.', ['Self-host'], ['Privacy'], '^4.0.0', 'intermediate', 'Flag'),
  compact('posthog-flags', 'PostHog Flags', 'بوست هوغ', 'Integrated', 'مدمج', 'PostHog flags.', 'أعلام PostHog.', ['All-in-one'], ['PostHog users'], 'Managed', 'beginner', 'Flag'),
  compact('unleash', 'Unleash', 'آن لِش', 'OSS', 'مفتوح المصدر', 'OSS flags.', 'OSS.', ['Self-host'], ['OSS apps'], '^6.0.0', 'intermediate', 'Flag'),
  compact('flagsmith', 'Flagsmith', 'فلاكس مِث', 'OSS', 'مفتوح المصدر', 'OSS flags.', 'OSS.', ['Cloud or self'], ['B2B'], 'Managed', 'intermediate', 'Flag'),
  compact('configcat', 'ConfigCat', 'كونفِق كات', 'Simple', 'بسيط', 'Simple flags.', 'أعلام بسيطة.', ['Easy'], ['Small teams'], 'Managed', 'beginner', 'Flag'),
  compact('none', 'No Feature Flags', 'بدون أعلام', 'None', 'بدون', 'No flags.', 'بدون.', ['Simpler'], ['Tiny apps'], '—', 'beginner', 'Minus'),
];

// ============== DESIGN ==============
export const cssFrameworks: CatalogEntry<CssFrameworkId>[] = [
  compact('tailwind', 'Tailwind CSS', 'تيلويند', 'Utility-first', 'مرافق أولًا', 'Utility-first.', 'قائم على المرافق.', ['Fast'], ['Most modern'], '^3.4.0', 'beginner', 'Wind'),
  compact('vanilla-css', 'Vanilla CSS', 'CSS خام', 'Native', 'أصلي', 'Plain CSS.', 'CSS خام.', ['No deps'], ['Tiny'], 'CSS 2024', 'beginner', 'Palette'),
  compact('css-modules', 'CSS Modules', 'وحدات CSS', 'Scoped', 'محلي', 'Locally scoped.', 'محلي.', ['No conflicts'], ['Component'], 'Bundler-native', 'beginner', 'Boxes'),
  compact('styled-components', 'Styled Components', 'ستايلد كومبوننتس', 'CSS-in-JS', 'CSS في JS', 'CSS-in-JS.', 'في JS.', ['Dynamic'], ['React'], '^6.1.0', 'intermediate', 'Code'),
  compact('emotion', 'Emotion', 'إموشن', 'CSS-in-JS', 'CSS في JS', 'CSS-in-JS.', 'في JS.', ['Fast'], ['React'], '^11.13.0', 'intermediate', 'Code'),
  compact('panda-css', 'Panda CSS', 'بندا', 'Zero-runtime', 'بدون تشغيل', 'Zero-runtime.', 'بدون تشغيل.', ['Type-safe'], ['Modern'], '^0.47.0', 'intermediate', 'Zap'),
  compact('vanilla-extract', 'Vanilla Extract', 'فانيلا إكستراكت', 'Zero-runtime', 'بدون تشغيل', 'CSS-in-TS.', 'في TS.', ['Type-safe'], ['TS apps'], '^3.9.0', 'advanced', 'Code'),
  compact('sass', 'Sass / SCSS', 'ساس', 'Preprocessor', 'معالج', 'CSS preprocessor.', 'معالج مسبق.', ['Variables'], ['Traditional'], '^1.79.0', 'beginner', 'Hash'),
  compact('unocss', 'UnoCSS', 'يونو', 'Atomic', 'ذري', 'Atomic CSS.', 'CSS ذري.', ['Fast'], ['Tailwind alt'], '^0.62.0', 'intermediate', 'Zap'),
  compact('open-props', 'Open Props', 'أوبن بروبس', 'CSS Variables', 'متغيرات', 'Custom properties.', 'متغيرات CSS.', ['No build'], ['Tokens'], '^1.7.0', 'beginner', 'Palette'),
  compact('none', 'No CSS Framework', 'بدون إطار CSS', 'None', 'بدون', 'No styles.', 'بدون تنسيق.', ['Simpler'], ['CLI / API'], '—', 'beginner', 'Minus'),
];

export const componentLibraries: CatalogEntry<ComponentLibraryId>[] = [
  compact('shadcn-ui', 'shadcn/ui', 'شادكن', 'Copy-paste', 'نسخ ولصق', 'Components on Radix.', 'مكونات على Radix.', ['You own code'], ['React + Tailwind'], '^2.1.0', 'intermediate', 'Component'),
  compact('radix-ui', 'Radix UI (Primitives)', 'رادِكس', 'Headless', 'بدون تنسيق', 'Unstyled primitives.', 'بدائيات بدون تنسيق.', ['A11y built-in'], ['Custom'], '^1.1.0', 'intermediate', 'Component'),
  compact('headless-ui', 'Headless UI', 'هيدليس', 'Headless', 'بدون تنسيق', 'Unstyled components.', 'بدون تنسيق.', ['Tailwind friendly'], ['Tailwind'], '^2.1.0', 'intermediate', 'Component'),
  compact('mantine', 'Mantine', 'مانتِين', 'Full library', 'مكتبة شاملة', 'Full-featured React.', 'شاملة.', ['90+ components'], ['Complex UIs'], '^7.13.0', 'intermediate', 'Component'),
  compact('chakra-ui', 'Chakra UI', 'شاكرا', 'Full library', 'مكتبة شاملة', 'Modular components.', 'معيارية.', ['Composable'], ['React'], '^3.0.0', 'intermediate', 'Component'),
  compact('mui', 'Material UI (MUI)', 'ماتيريال', 'Material Design', 'Material', "Google's Material.", 'Material جوجل.', ['Mature'], ['Enterprise React'], '^6.1.0', 'intermediate', 'Component'),
  compact('ant-design', 'Ant Design', 'أنت', 'Enterprise', 'مؤسساتي', 'Alibaba enterprise UI.', 'مؤسساتي علي بابا.', ['Comprehensive'], ['Admin panels'], '^5.21.0', 'intermediate', 'Component'),
  compact('nextui', 'NextUI (HeroUI)', 'نيكست يو آي', 'Modern', 'حديث', 'Modern React UI.', 'حديث.', ['Beautiful defaults'], ['Modern'], '^2.4.0', 'beginner', 'Component'),
  compact('heroui', 'HeroUI', 'هيرو يو آي', 'Modern', 'حديث', 'Fork of NextUI.', 'شوكة NextUI.', ['Beautiful defaults'], ['Modern'], '^2.4.0', 'beginner', 'Component'),
  compact('daisyui', 'DaisyUI', 'ديزي', 'Tailwind plugin', 'إضافة Tailwind', 'Tailwind components plugin.', 'مكونات Tailwind.', ['Tailwind-native'], ['Quick'], '^4.12.0', 'beginner', 'Component'),
  compact('flowbite', 'Flowbite', 'فلوبايت', 'Tailwind plugin', 'إضافة Tailwind', 'Tailwind components.', 'مكونات Tailwind.', ['Ready-made'], ['Quick'], '^2.5.0', 'beginner', 'Component'),
  compact('park-ui', 'Park UI', 'بارك يو آي', 'Modern Panda', 'حديث Panda', 'Modern Panda CSS.', 'حديث Panda.', ['Panda-powered'], ['Panda stacks'], '^0.42.0', 'intermediate', 'Component'),
  compact('none', 'No Component Library', 'بدون مكتبة', 'None', 'بدون', 'Build from scratch.', 'ابنِ من الصفر.', ['Full control'], ['Custom'], '—', 'advanced', 'Minus'),
];

export const iconSets: CatalogEntry<IconSetId>[] = [
  compact('lucide', 'Lucide', 'لوسيد', 'SVG', 'SVG', 'Open-source icons.', 'مفتوح المصدر.', ['Tree-shakeable'], ['Most apps'], '^0.451.0', 'beginner', 'Star'),
  compact('heroicons', 'Heroicons', 'هيرو', 'SVG', 'SVG', 'Tailwind Labs icons.', 'أيقونات Tailwind Labs.', ['Tailwind style'], ['Tailwind'], '^2.1.5', 'beginner', 'Star'),
  compact('tabler', 'Tabler Icons', 'تابلر', 'SVG', 'SVG', '4500+ icons.', 'أكثر من 4500.', ['Huge set'], ['Diverse'], '^3.19.0', 'beginner', 'Star'),
  compact('phosphor', 'Phosphor Icons', 'فوسفور', 'SVG', 'SVG', 'Flexible icon family.', 'عائلة مرنة.', ['Multiple weights'], ['Design systems'], '^2.1.0', 'beginner', 'Star'),
  compact('feather', 'Feather Icons', 'فِذر', 'SVG', 'SVG', 'Simple line icons.', 'خطية بسيطة.', ['Minimal'], ['Minimal UIs'], '^4.29.2', 'beginner', 'Star'),
  compact('fontawesome', 'Font Awesome', 'فونت أويسم', 'Font/SVG', 'خط/SVG', 'Massive icon font.', 'خط ضخم.', ['Huge'], ['Classic'], '^6.7.0', 'beginner', 'Star'),
  compact('material-icons', 'Material Icons', 'ماتيريال', 'Google', 'جوجل', "Google's Material.", 'Material جوجل.', ['Material Design'], ['Material apps'], '^1.13.12', 'beginner', 'Star'),
  compact('none', 'No Icon Set', 'بدون أيقونات', 'None', 'بدون', 'No icons.', 'بدون.', ['Simpler'], ['Text-only'], '—', 'beginner', 'Minus'),
];

export const fontFamilies: CatalogEntry<FontFamilyId>[] = [
  compact('inter', 'Inter', 'إنتر', 'Latin', 'لاتيني', 'Modern UI font.', 'خط واجهة حديث.', ['Variable font'], ['Most apps'], 'Latest', 'beginner', 'Type'),
  compact('roboto', 'Roboto', 'روبوتو', 'Latin', 'لاتيني', "Google's UI font.", 'خط جوجل.', ['Familiar'], ['Material'], 'Latest', 'beginner', 'Type'),
  compact('open-sans', 'Open Sans', 'أوبن سانس', 'Latin', 'لاتيني', 'Friendly open font.', 'خط ودود.', ['Neutral'], ['General'], 'Latest', 'beginner', 'Type'),
  compact('poppins', 'Poppins', 'بوبِنس', 'Latin', 'لاتيني', 'Geometric sans.', 'هندسي.', ['Modern'], ['Marketing'], 'Latest', 'beginner', 'Type'),
  compact('cairo', 'Cairo', 'القاهرة', 'Arabic', 'عربي', 'Arabic-first modern font.', 'حديث عربي.', ['Beautiful Arabic'], ['Arabic UIs'], 'Latest', 'beginner', 'Type'),
  compact('tajawal', 'Tajawal', 'تجوال', 'Arabic', 'عربي', 'Modern Arabic font.', 'حديث.', ['Versatile'], ['Arabic'], 'Latest', 'beginner', 'Type'),
  compact('almarai', 'Almarai', 'المرعى', 'Arabic', 'عربي', 'Arabic Google font.', 'جوجل عربي.', ['Clear'], ['Arabic'], 'Latest', 'beginner', 'Type'),
  compact('ibm-plex-sans-arabic', 'IBM Plex Sans Arabic', 'آي بي إم بلكس', 'Arabic', 'عربي', "IBM's Arabic font.", 'خط آي بي إم.', ['Professional'], ['Enterprise Arabic'], 'Latest', 'beginner', 'Type'),
  compact('noto-sans', 'Noto Sans (multi-script)', 'نوتو سانس', 'Multi-script', 'متعدد', 'Covers every script.', 'يغطي كل اللغات.', ['Complete'], ['Multi-language'], 'Latest', 'beginner', 'Type'),
  compact('system-default', 'System Default', 'خط النظام', 'Native', 'أصلي', 'OS fonts.', 'خطوط النظام.', ['Zero load'], ['Performance'], '—', 'beginner', 'Type'),
];

// ============== I18N LOCALES ==============
export interface LocaleMeta {
  id: LocaleId;
  name: string;
  nativeName: string;
  nameAr: string;
  direction: 'ltr' | 'rtl';
  region: string;
  regionAr: string;
}

export const locales: LocaleMeta[] = [
  { id: 'en', name: 'English', nativeName: 'English', nameAr: 'الإنجليزية', direction: 'ltr', region: 'Global', regionAr: 'عالمي' },
  { id: 'ar', name: 'Arabic', nativeName: 'العربية', nameAr: 'العربية', direction: 'rtl', region: 'MENA', regionAr: 'الشرق الأوسط' },
  { id: 'es', name: 'Spanish', nativeName: 'Español', nameAr: 'الإسبانية', direction: 'ltr', region: 'LatAm', regionAr: 'أمريكا اللاتينية' },
  { id: 'fr', name: 'French', nativeName: 'Français', nameAr: 'الفرنسية', direction: 'ltr', region: 'Europe/Africa', regionAr: 'أوروبا' },
  { id: 'de', name: 'German', nativeName: 'Deutsch', nameAr: 'الألمانية', direction: 'ltr', region: 'Europe', regionAr: 'أوروبا' },
  { id: 'pt', name: 'Portuguese', nativeName: 'Português', nameAr: 'البرتغالية', direction: 'ltr', region: 'Brazil', regionAr: 'البرازيل' },
  { id: 'ru', name: 'Russian', nativeName: 'Русский', nameAr: 'الروسية', direction: 'ltr', region: 'CIS', regionAr: 'دول الكومنولث' },
  { id: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '简体中文', nameAr: 'الصينية المبسطة', direction: 'ltr', region: 'China', regionAr: 'الصين' },
  { id: 'zh-TW', name: 'Chinese (Traditional)', nativeName: '繁體中文', nameAr: 'الصينية التقليدية', direction: 'ltr', region: 'Taiwan', regionAr: 'تايوان' },
  { id: 'ja', name: 'Japanese', nativeName: '日本語', nameAr: 'اليابانية', direction: 'ltr', region: 'Japan', regionAr: 'اليابان' },
  { id: 'ko', name: 'Korean', nativeName: '한국어', nameAr: 'الكورية', direction: 'ltr', region: 'Korea', regionAr: 'كوريا' },
  { id: 'hi', name: 'Hindi', nativeName: 'हिन्दी', nameAr: 'الهندية', direction: 'ltr', region: 'India', regionAr: 'الهند' },
  { id: 'tr', name: 'Turkish', nativeName: 'Türkçe', nameAr: 'التركية', direction: 'ltr', region: 'Türkiye', regionAr: 'تركيا' },
  { id: 'it', name: 'Italian', nativeName: 'Italiano', nameAr: 'الإيطالية', direction: 'ltr', region: 'Europe', regionAr: 'أوروبا' },
  { id: 'nl', name: 'Dutch', nativeName: 'Nederlands', nameAr: 'الهولندية', direction: 'ltr', region: 'Europe', regionAr: 'أوروبا' },
  { id: 'pl', name: 'Polish', nativeName: 'Polski', nameAr: 'البولندية', direction: 'ltr', region: 'Europe', regionAr: 'أوروبا' },
  { id: 'uk', name: 'Ukrainian', nativeName: 'Українська', nameAr: 'الأوكرانية', direction: 'ltr', region: 'Europe', regionAr: 'أوروبا' },
  { id: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', nameAr: 'الفيتنامية', direction: 'ltr', region: 'ASEAN', regionAr: 'آسيان' },
  { id: 'th', name: 'Thai', nativeName: 'ไทย', nameAr: 'التايلاندية', direction: 'ltr', region: 'ASEAN', regionAr: 'آسيان' },
  { id: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', nameAr: 'الإندونيسية', direction: 'ltr', region: 'ASEAN', regionAr: 'آسيان' },
  { id: 'he', name: 'Hebrew', nativeName: 'עברית', nameAr: 'العبرية', direction: 'rtl', region: 'Israel', regionAr: 'إسرائيل' },
  { id: 'fa', name: 'Persian', nativeName: 'فارسی', nameAr: 'الفارسية', direction: 'rtl', region: 'Iran', regionAr: 'إيران' },
  { id: 'ur', name: 'Urdu', nativeName: 'اردو', nameAr: 'الأوردو', direction: 'rtl', region: 'Pakistan', regionAr: 'باكستان' },
];

export const translationSources: CatalogEntry<TranslationSourceId>[] = [
  compact('local-json', 'Local JSON files', 'ملفات JSON', 'In-repo', 'داخل', 'JSON files.', 'JSON.', ['Simple'], ['Small apps'], 'N/A', 'beginner', 'FileJson'),
  compact('crowdin', 'Crowdin', 'كراودن', 'SaaS TMS', 'SaaS TMS', 'Translation platform.', 'منصة ترجمات.', ['Translators UI'], ['Teams'], 'Managed', 'intermediate', 'Globe'),
  compact('lokalise', 'Lokalise', 'لوكلايز', 'SaaS TMS', 'SaaS TMS', 'Developer-friendly TMS.', 'للمطورين.', ['CI/CD'], ['Dev teams'], 'Managed', 'intermediate', 'Globe'),
  compact('phrase', 'Phrase', 'فريز', 'SaaS TMS', 'SaaS TMS', 'Localization platform.', 'توطين.', ['Strong DX'], ['Continuous l10n'], 'Managed', 'intermediate', 'Globe'),
  compact('transifex', 'Transifex', 'ترانسفِكس', 'SaaS TMS', 'SaaS TMS', 'Translation management.', 'إدارة ترجمات.', ['Mature'], ['Enterprise'], 'Managed', 'intermediate', 'Globe'),
  compact('i18next-cms', 'i18next Backend', 'i18next', 'OSS', 'OSS', 'i18next backend.', 'i18next.', ['OSS option'], ['i18next apps'], '^3.0.0', 'intermediate', 'Globe'),
  compact('tolgee', 'Tolgee', 'تولجي', 'Dev TMS', 'TMS', 'In-context editing.', 'تعديل في السياق.', ['In-context'], ['Dev teams'], 'Managed', 'intermediate', 'Globe'),
  compact('in-house-cms', 'In-house CMS', 'داخلي', 'Custom', 'مخصص', 'Roll your own.', 'خاص.', ['Full control'], ['Custom'], 'N/A', 'advanced', 'Code'),
];

// ============== TESTING & DEVOPS ==============
export const unitTestTools: CatalogEntry<UnitTestId>[] = [
  compact('vitest', 'Vitest', 'فيتست', 'JS/TS', 'JS/TS', 'Vite-native.', 'Vite أصلي.', ['Fast'], ['Vite/React'], '^2.1.0', 'beginner', 'TestTube'),
  compact('jest', 'Jest', 'جيست', 'JS/TS', 'JS/TS', 'Classic JS test.', 'كلاسيكي.', ['Mature'], ['CRA'], '^29.7.0', 'beginner', 'TestTube'),
  compact('mocha', 'Mocha', 'موكا', 'JS/TS', 'JS/TS', 'Flexible JS test.', 'مرن.', ['Flexible'], ['Node legacy'], '^10.7.3', 'intermediate', 'TestTube'),
  compact('pytest', 'pytest', 'بايتست', 'Python', 'بايثون', 'Python testing.', 'بايثون.', ['Fixtures'], ['Python'], '^8.3.0', 'beginner', 'TestTube'),
  compact('junit', 'JUnit 5', 'جي يو آي تي', 'JVM', 'JVM', 'Java testing.', 'جافا.', ['Industry standard'], ['Java'], '^5.10.0', 'intermediate', 'TestTube'),
  compact('go-test', 'go test', 'جو تست', 'Go', 'جو', 'Built-in Go testing.', 'مدمج في جو.', ['Built-in'], ['Go'], 'Built-in', 'beginner', 'TestTube'),
  compact('cargo-test', 'cargo test', 'كارغو', 'Rust', 'رست', 'Built-in Rust.', 'مدمج في Rust.', ['Built-in'], ['Rust'], 'Built-in', 'beginner', 'TestTube'),
  compact('rspec', 'RSpec', 'آر سبيك', 'Ruby', 'روبي', 'Ruby testing.', 'روبي.', ['Expressive'], ['Rails'], '^3.13.0', 'intermediate', 'TestTube'),
  compact('phpunit', 'PHPUnit', 'بي إتش بي', 'PHP', 'بي إتش بي', 'PHP testing.', 'PHP.', ['Mature'], ['PHP'], '^11.0.0', 'intermediate', 'TestTube'),
  compact('xunit', 'xUnit', 'إكس يو آي تي', '.NET', '.NET', '.NET testing.', '.NET.', ['Mature'], ['.NET'], '^2.9.0', 'intermediate', 'TestTube'),
  compact('none', 'No Unit Tests', 'بدون وحدة', 'None', 'بدون', 'Skip unit tests.', 'بدون.', ['Faster'], ['Throwaway'], 'N/A', 'beginner', 'Minus'),
];

export const componentTestTools: CatalogEntry<ComponentTestId>[] = [
  compact('react-testing-library', 'React Testing Library', 'مكتبة رياكت', 'React', 'رياكت', 'User-centric.', 'مستخدم محوره.', ['Best practices'], ['React'], '^16.0.1', 'beginner', 'Component'),
  compact('vue-test-utils', 'Vue Test Utils', 'فيو', 'Vue', 'فيو', 'Vue testing.', 'اختبار فيو.', ['Official'], ['Vue'], '^2.4.6', 'beginner', 'Component'),
  compact('cypress-component', 'Cypress Component', 'سايبريس', 'Multi', 'متعدد', 'Cypress for components.', 'سايبريس للمكونات.', ['Visual'], ['Visual tests'], '^13.15.0', 'intermediate', 'Component'),
  compact('storybook-tests', 'Storybook Tests', 'ستوريبوك', 'Storybook', 'ستوريبوك', 'Storybook tests.', 'اختبارات ستوريبوك.', ['Visual regression'], ['Design systems'], '^0.20.0', 'intermediate', 'Component'),
  compact('none', 'No Component Tests', 'بدون مكونات', 'None', 'بدون', 'Skip.', 'بدون.', ['Faster'], ['Backend'], 'N/A', 'beginner', 'Minus'),
];

export const e2eTestTools: CatalogEntry<E2eTestId>[] = [
  compact('playwright', 'Playwright', 'بلاي رايت', 'Cross-browser', 'متعدد المتصفحات', 'Modern cross-browser.', 'متعدد المتصفحات.', ['Multi-browser'], ['Most web'], '^1.47.0', 'intermediate', 'PlayCircle'),
  compact('cypress', 'Cypress', 'سايبريس', 'Web E2E', 'ويب شامل', 'Developer-friendly.', 'سهل.', ['DX'], ['Web apps'], '^13.15.0', 'beginner', 'PlayCircle'),
  compact('puppeteer', 'Puppeteer', 'بَبِتير', 'Headless Chrome', 'كروم بدون واجهة', 'Node library.', 'مكتبة Node.', ['Programmable'], ['Scraping'], '^23.6.0', 'intermediate', 'PlayCircle'),
  compact('webdriver-io', 'WebdriverIO', 'ويب درايفر', 'Web + Mobile', 'ويب + جوال', 'WebDriver-based.', 'WebDriver.', ['Mobile + Web'], ['Cross-platform'], '^9.1.0', 'intermediate', 'PlayCircle'),
  compact('detox', 'Detox', 'ديتوكس', 'Mobile Native', 'جوال أصلي', 'E2E for RN.', 'لـ RN.', ['RN-first'], ['React Native'], '^20.27.0', 'advanced', 'Smartphone'),
  compact('maestro', 'Maestro', 'مايسترُ', 'Mobile', 'جوال', 'Mobile E2E, simple YAML.', 'جوال بـ YAML.', ['Simple'], ['Mobile'], '^1.40.0', 'beginner', 'Smartphone'),
  compact('none', 'No E2E', 'بدون شامل', 'None', 'بدون', 'Skip E2E.', 'بدون.', ['Faster'], ['Tiny'], 'N/A', 'beginner', 'Minus'),
];

export const apiTestTools: CatalogEntry<ApiTestId>[] = [
  compact('supertest', 'Supertest', 'سوبِر تست', 'JS/TS', 'JS/TS', 'HTTP assertions for Node.', 'تأكيدات Node.', ['Simple'], ['Node APIs'], '^7.0.0', 'beginner', 'Cable'),
  compact('postman-newman', 'Postman + Newman', 'بوستمان', 'Multi', 'متعدد', 'Postman CLI.', 'بوستمان CLI.', ['GUI + CLI'], ['Manual + CI'], '^6.1.0', 'beginner', 'Cable'),
  compact('insomnia', 'Insomnia', 'إنسومنيا', 'API Client', 'عميل', 'API client with testing.', 'عميل API.', ['GraphQL'], ['API exploration'], '^9.5.0', 'beginner', 'Cable'),
  compact('httpie', 'HTTPie', 'إتش تي تي بي', 'CLI', 'سطر أوامر', 'User-friendly CLI.', 'ودود.', ['Readable'], ['Manual'], '^3.2.3', 'beginner', 'Terminal'),
  compact('rest-assured', 'REST Assured', 'ريست أسيورد', 'JVM', 'JVM', 'Java DSL.', 'Java DSL.', ['Expressive'], ['Java APIs'], '^5.5.0', 'intermediate', 'Cable'),
  compact('tavern', 'Tavern', 'تافِرن', 'Python', 'بايثون', 'Pytest-based.', 'قائم على pytest.', ['YAML'], ['Python APIs'], '^2.10.0', 'intermediate', 'Cable'),
  compact('none', 'No API Tests', 'بدون API', 'None', 'بدون', 'Skip.', 'بدون.', ['Faster'], ['No API'], 'N/A', 'beginner', 'Minus'),
];

export const ciProviders: CatalogEntry<CiId>[] = [
  compact('github-actions', 'GitHub Actions', 'أكشنز', 'Git-native', 'مدعوم من Git', 'GitHub CI/CD.', 'CI/CD لـ GitHub.', ['Free tier'], ['GitHub'], 'Managed', 'beginner', 'Github'),
  compact('gitlab-ci', 'GitLab CI', 'جيtlاب', 'Git-native', 'مدعوم من Git', 'CI/CD in GitLab.', 'في GitLab.', ['Built-in'], ['GitLab'], 'Managed', 'beginner', 'GitBranch'),
  compact('circleci', 'CircleCI', 'سيركل', 'Cloud', 'سحابي', 'Cloud CI.', 'سحابي.', ['Powerful orbs'], ['Complex'], 'Managed', 'intermediate', 'RotateCw'),
  compact('jenkins', 'Jenkins', 'جينكنز', 'Self-hosted', 'ذاتي', 'Self-hosted CI.', 'ذاتي.', ['Plugins'], ['On-prem'], 'LTS', 'advanced', 'Server'),
  compact('buildkite', 'Buildkite', 'بيلد كايت', 'Hybrid', 'هجين', 'Hybrid CI/CD.', 'هجين.', ['Self-hosted agents'], ['Monorepos'], 'Managed', 'advanced', 'Hammer'),
  compact('azure-pipelines', 'Azure Pipelines', 'بايبلاينز', 'Azure', 'أزور', 'Azure CI/CD.', 'أزور.', ['Azure'], ['Azure shops'], 'Managed', 'intermediate', 'Cloud'),
  compact('bitbucket-pipelines', 'Bitbucket Pipelines', 'بت باكت', 'Atlassian', 'أتلسين', 'Bitbucket CI/CD.', 'بت باكت.', ['Atlassian'], ['Bitbucket'], 'Managed', 'beginner', 'GitBranch'),
  compact('drone', 'Drone CI', 'درون', 'Container-native', 'حاويات', 'Container-native.', 'قائم على الحاويات.', ['Docker-based'], ['Container'], '^2.23.0', 'intermediate', 'Container'),
  compact('travis-ci', 'Travis CI', 'ترافيس', 'Cloud', 'سحابي', 'Classic cloud CI.', 'كلاسيكي.', ['Simple config'], ['OSS'], 'Managed', 'beginner', 'RotateCw'),
  compact('none', 'No CI', 'بدون CI', 'None', 'بدون', 'No CI.', 'بدون.', ['Simpler'], ['Throwaway'], 'N/A', 'beginner', 'Minus'),
];

export const cdStrategies: CatalogEntry<CdId>[] = [
  compact('vercel-deploy', 'Vercel Deploy', 'فيرسيل', 'PaaS-native', 'PaaS أصلي', 'Vercel Git deploys.', 'نشر Git لـ فيرسيل.', ['Zero-config'], ['Vercel apps'], 'Managed', 'beginner', 'Triangle'),
  compact('netlify-deploy', 'Netlify Deploy', 'نتلايفي', 'PaaS-native', 'PaaS أصلي', 'Netlify Git deploys.', 'نشر نتلايفي.', ['Zero-config'], ['Netlify'], 'Managed', 'beginner', 'Triangle'),
  compact('aws-codedeploy', 'AWS CodeDeploy', 'CodeDeploy', 'AWS', 'AWS', 'AWS deployment.', 'نشر AWS.', ['AWS'], ['AWS'], 'Managed', 'advanced', 'Cloud'),
  compact('gcp-cloud-deploy', 'GCP Cloud Deploy', 'كلاود ديبloy', 'GCP', 'GCP', 'GCP CD.', 'نشر GCP.', ['GCP'], ['GCP shops'], 'Managed', 'advanced', 'Cloud'),
  compact('argocd', 'Argo CD', 'أرغو', 'GitOps', 'GitOps', 'GitOps for K8s.', 'GitOps لـ K8s.', ['GitOps'], ['Kubernetes'], '^2.11.0', 'advanced', 'Boxes'),
  compact('fluxcd', 'Flux CD', 'فلَكس', 'GitOps', 'GitOps', 'GitOps for K8s.', 'GitOps لـ K8s.', ['CNCF'], ['Kubernetes'], '^2.3.0', 'advanced', 'Boxes'),
  compact('spinnaker', 'Spinnaker', 'سبينَكر', 'Multi-cloud', 'متعدد السحب', 'Multi-cloud CD.', 'متعدد السحب.', ['Multi-cloud'], ['Enterprise'], 'Managed', 'advanced', 'GitMerge'),
  compact('manual-ssh', 'Manual SSH', 'SSH يدوي', 'Manual', 'يدوي', 'Manual deploy.', 'نشر يدوي.', ['No setup'], ['Personal'], 'N/A', 'beginner', 'Terminal'),
];

export const iacTools: CatalogEntry<IacId>[] = [
  compact('terraform', 'Terraform', 'تيرافورم', 'Multi-cloud', 'متعدد السحب', 'HashiCorp IaC.', 'B كرمز.', ['Multi-cloud'], ['Most infra'], '^1.9.0', 'advanced', 'Blocks'),
  compact('pulumi', 'Pulumi', 'بولومي', 'Code-first', 'B كأول', 'IaC with languages.', 'بلغات برمجة.', ['TS/Go/Python'], ['Devs'], '^3.124.0', 'advanced', 'Code'),
  compact('cdk', 'AWS CDK', 'سي دي كي', 'AWS', 'AWS', 'AWS IaC.', 'AWS B كرمز.', ['Type-safe AWS'], ['AWS shops'], '^2.150.0', 'advanced', 'Cloud'),
  compact('ansible', 'Ansible', 'أنسيبل', 'Config Mgmt', 'إدارة', 'Agentless config.', 'بدون عميل.', ['YAML'], ['Server config'], '^10.4.0', 'intermediate', 'Terminal'),
  compact('cloudformation', 'CloudFormation', 'فورميشن', 'AWS', 'AWS', "AWS's IaC.", 'AWS.', ['AWS-native'], ['AWS-only'], 'Managed', 'advanced', 'Cloud'),
  compact('opentofu', 'OpenTofu', 'أوبن توفو', 'OSS Terraform', 'تيرافورم OSS', 'OSS Terraform fork.', 'شوكة OSS.', ['Open source'], ['OSS'], '^1.7.0', 'advanced', 'Blocks'),
  compact('none', 'No IaC', 'بدون IaC', 'None', 'بدون', 'No IaC.', 'بدون.', ['Simpler'], ['Tiny'], 'N/A', 'beginner', 'Minus'),
];

export const packageManagers: CatalogEntry<PackageManagerId>[] = [
  compact('npm', 'npm', 'إن بي إم', 'Node.js', 'Node.js', 'Default Node.', 'Node الافتراضي.', ['Default'], ['Node'], '^10.9.0', 'beginner', 'Package'),
  compact('pnpm', 'pnpm', 'بي إن بي إم', 'Node.js', 'Node.js', 'Fast, disk-efficient.', 'سريع وموفر.', ['Fast'], ['Monorepos'], '^9.12.0', 'beginner', 'Package'),
  compact('yarn', 'Yarn', 'يَيرن', 'Node.js', 'Node.js', 'Facebook Node.', 'Node فيسبوك.', ['Workspaces'], ['Workspaces'], '^4.5.0', 'beginner', 'Package'),
  compact('bun', 'Bun', 'بَن', 'Node.js (alt)', 'Node.js بديل', 'All-in-one.', 'شامل.', ['Fast'], ['Modern'], '^1.1.30', 'beginner', 'Package'),
  compact('pip', 'pip', 'بب', 'Python', 'بايثون', 'Default Python.', 'Python الافتراضي.', ['Default'], ['Python'], '^24.2', 'beginner', 'Package'),
  compact('poetry', 'Poetry', 'بوتري', 'Python', 'بايثون', 'Modern Python.', 'حديث.', ['Lock file'], ['Modern Python'], '^1.8.0', 'intermediate', 'Package'),
  compact('uv', 'uv', 'يو في', 'Python', 'بايثون', 'Ultra-fast Python.', 'فائق السرعة.', ['Very fast'], ['Modern Python'], '^0.4.0', 'beginner', 'Package'),
  compact('maven', 'Maven', 'مافن', 'JVM', 'JVM', 'Java build.', 'بناء جافا.', ['Mature'], ['Java'], '^3.9.0', 'intermediate', 'Package'),
  compact('gradle', 'Gradle', 'قريدِل', 'JVM', 'JVM', 'Java/Kotlin build.', 'جافا/كوتلن.', ['Fast'], ['Android, Kotlin'], '^8.10.0', 'intermediate', 'Package'),
  compact('cargo', 'cargo', 'كارغو', 'Rust', 'رست', 'Rust package manager.', 'مدير Rust.', ['Built-in'], ['Rust'], 'Built-in', 'beginner', 'Package'),
  compact('go-modules', 'Go Modules', 'وحدات Go', 'Go', 'جو', 'Go module system.', 'وحدات Go.', ['Built-in'], ['Go'], 'Built-in', 'beginner', 'Package'),
  compact('bundler', 'Bundler (Ruby)', 'بَندلِر', 'Ruby', 'روبي', 'Ruby dependencies.', 'تبعيات روبي.', ['Mature'], ['Rails'], '^2.5.0', 'intermediate', 'Package'),
  compact('composer', 'Composer (PHP)', 'كومبوزر', 'PHP', 'بي إتش بي', 'PHP dependencies.', 'تبعيات PHP.', ['Mature'], ['PHP'], '^2.8.0', 'beginner', 'Package'),
];

export const monorepoTools: CatalogEntry<MonorepoId>[] = [
  compact('turborepo', 'Turborepo', 'توربو', 'JS/TS', 'JS/TS', 'Incremental task runner.', 'منفّذ تدريجي.', ['Fast'], ['JS monorepos'], '^2.3.0', 'intermediate', 'Layers'),
  compact('nx', 'Nx', 'إن إكس', 'JS/TS', 'JS/TS', 'Smart monorepo.', 'ذكي.', ['Affected graph'], ['Large'], '^19.7.0', 'advanced', 'Network'),
  compact('rush', 'Rush', 'رَش', 'JS/TS', 'JS/TS', 'Microsoft monorepo.', 'مايكروسوفت.', ['Enterprise'], ['Enterprise'], '^5.124.0', 'advanced', 'Layers'),
  compact('pnpm-workspaces', 'pnpm Workspaces', 'مساحات pnpm', 'JS/TS', 'JS/TS', 'Built-in pnpm workspaces.', 'مساحات pnpm.', ['Simple'], ['Small monorepos'], 'Built-in', 'beginner', 'Package'),
  compact('yarn-workspaces', 'Yarn Workspaces', 'مساحات Yarn', 'JS/TS', 'JS/TS', 'Built-in Yarn workspaces.', 'مساحات Yarn.', ['Simple'], ['Small monorepos'], 'Built-in', 'beginner', 'Package'),
  compact('bazel', 'Bazel', 'بازِل', 'Polyglot', 'متعدد اللغات', 'Google build.', 'نظام جوجل.', ['Polyglot'], ['Massive'], '^7.4.0', 'advanced', 'Hammer'),
  compact('lerna', 'Lerna', 'لِرنا', 'JS/TS', 'JS/TS', 'Original JS monorepo.', 'الأصلي.', ['Mature'], ['Simple'], '^8.1.0', 'intermediate', 'Package'),
  compact('none', 'No Monorepo', 'بدون مونوريبو', 'None', 'بدون', 'Single package.', 'حزمة واحدة.', ['Simpler'], ['Most apps'], 'N/A', 'beginner', 'Minus'),
];