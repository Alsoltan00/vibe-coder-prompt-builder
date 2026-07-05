// =====================================================================
//   UI translations (AR + EN)
// =====================================================================

import type { UiLocale, WizardStepId } from '@/types';

export interface Translation {
  appName: string;
  appTagline: string;
  nav: { next: string; back: string; skip: string; restart: string; finish: string };
  steps: Record<WizardStepId, { title: string; description: string; hint?: string }>;
  search: string;
  selected: (n: number) => string;
  noResults: string;
  errors: { required: string; pickOne: string };
  welcome: {
    heading: string;
    subheading: string;
    start: string;
    features: string[];
    shortcutsLabel: string;
    shortcuts: { key: string; action: string }[];
  };
  compatibility: {
    title: string;
    blockers: string;
    warnings: string;
    info: string;
    autofix: string;
  };
  generate: {
    heading: string;
    subheading: string;
    tabs: { skill: string; cursor: string; prompt: string };
    copy: string;
    copied: string;
    download: string;
    loading: string;
    success: string;
  };
}

const ar: Translation = {
  appName: 'مولّد البرومبت الذكي',
  appTagline: 'حوّل فكرتك إلى Skill احترافي جاهز',
  nav: {
    next: 'التالي',
    back: 'السابق',
    skip: 'تخطّي',
    restart: 'ابدأ من جديد',
    finish: 'إنهاء',
  },
  steps: {
    welcome: { title: 'مرحبًا', description: 'أهلًا بك' },
    'project-type': { title: 'نوع المشروع', description: 'اختر أقرب نوع لمشروعك', hint: 'استخدم 1-9 للاختيار السريع' },
    identity: { title: 'تفاصيل المشروع', description: 'اسم + وصف + جمهور مستهدف' },
    features: { title: 'الميزات الأساسية', description: 'الميزات اللي يحتاجها منتجك' },
    language: { title: 'لغة البرمجة', description: 'اللغة الأساسية للمشروع' },
    frontend: { title: 'إطار الواجهة', description: 'إطار Frontend (إن وُجد)' },
    backend: { title: 'إطار الخادم', description: 'إطار Backend (إن وُجد)' },
    database: { title: 'قواعد البيانات', description: '7 طبقات مستقلة — كل واحدة تختار منها' },
    hosting: { title: 'الاستضافة', description: '5 طبقات (Frontend/Backend/DB/CDN/تنسيق)' },
    auth: { title: 'المصادقة', description: 'مزود رئيسي + شبكات اجتماعية + SSO + MFA' },
    design: { title: 'نظام التصميم', description: 'CSS + مكونات + أيقونات + خطوط' },
    i18n: { title: 'تعدد اللغات', description: 'اللغات المدعومة واتجاه النص' },
    'third-party': { title: 'الخدمات الخارجية', description: 'مدفوعات، بريد، SMS، تحليلات، مراقبة' },
    testing: { title: 'الاختبارات', description: 'Unit + Component + E2E + API' },
    devops: { title: 'CI/CD و DevOps', description: 'CI + CD + IaC + مدير حزم' },
    professional: { title: 'ميزات احترافية', description: '10 ميزات عرضية' },
    additional: { title: 'تفاصيل إضافية', description: 'أي شي ما ذكرناه' },
    generate: { title: 'توليد البرومبت', description: 'احصل على Skill نهائي' },
  },
  search: 'ابحث…',
  selected: (n) => `المختار: ${n}`,
  noResults: 'لا توجد نتائج',
  errors: { required: 'هذا الحقل مطلوب', pickOne: 'اختر واحد على الأقل' },
  welcome: {
    heading: 'حوّل فكرتك إلى Skill احترافي',
    subheading:
      'أجب على 17 سؤالًا بسيطًا عن مشروعك، وسنولّد لك Skill قوي + Cursor Rules + Master Prompt — كلها بدون أي API key، بدون إنترنت، وبدون تداخل بين اختياراتك.',
    start: 'ابدأ الآن →',
    features: [
      '17 خطوة منظّمة',
      'محرك توافق ذكي',
      'اختصارات لوحة المفاتيح',
      'بدون API key',
      'Skill + Cursor + Prompt',
      '23 لغة UI',
    ],
    shortcutsLabel: 'اختصارات لوحة المفاتيح',
    shortcuts: [
      { key: 'Ctrl/⌘ + Enter', action: 'الخطوة التالية' },
      { key: 'Esc', action: 'الخطوة السابقة' },
      { key: '1-9', action: 'اختيار سريع من الأرقام' },
      { key: 'Arrow keys', action: 'التنقل بين الخيارات' },
      { key: '/', action: 'تركيز البحث' },
    ],
  },
  compatibility: {
    title: 'تنبيهات التوافق',
    blockers: 'أخطاء تمنع المتابعة',
    warnings: 'تحذيرات',
    info: 'معلومات',
    autofix: 'إصلاح تلقائي',
  },
  generate: {
    heading: 'البرومبت الجاهز',
    subheading: 'ثلاث صيغ قابلة للنسخ مباشرة',
    tabs: { skill: 'Claude Skill', cursor: 'Cursor Rules', prompt: 'Master Prompt' },
    copy: 'نسخ',
    copied: 'تم النسخ ✓',
    download: 'تنزيل',
    loading: 'جارٍ التوليد…',
    success: 'جاهز',
  },
};

const en: Translation = {
  appName: 'Pro Prompt Builder',
  appTagline: 'Turn your idea into a build-ready Skill',
  nav: {
    next: 'Next',
    back: 'Back',
    skip: 'Skip',
    restart: 'Start Over',
    finish: 'Finish',
  },
  steps: {
    welcome: { title: 'Welcome', description: 'Hello there' },
    'project-type': { title: 'Project Type', description: 'Pick the closest match', hint: 'Use 1-9 for quick select' },
    identity: { title: 'Project Details', description: 'Name + description + audience' },
    features: { title: 'Core Features', description: 'Features your product needs' },
    language: { title: 'Programming Language', description: 'Primary language' },
    frontend: { title: 'Frontend Framework', description: 'UI framework (if any)' },
    backend: { title: 'Backend Framework', description: 'Backend (if any)' },
    database: { title: 'Databases', description: '7 independent layers — pick from each' },
    hosting: { title: 'Hosting & Infra', description: 'Frontend / Backend / DB / CDN / Orchestration' },
    auth: { title: 'Authentication', description: 'Primary + social + SSO + MFA' },
    design: { title: 'Design System', description: 'CSS + components + icons + fonts' },
    i18n: { title: 'Internationalization', description: 'Languages + RTL' },
    'third-party': { title: 'Third-Party Services', description: 'Payments, email, SMS, analytics, monitoring' },
    testing: { title: 'Testing', description: 'Unit + Component + E2E + API' },
    devops: { title: 'CI/CD & DevOps', description: 'CI + CD + IaC + package manager' },
    professional: { title: 'Professional Features', description: '10 cross-cutting' },
    additional: { title: 'Additional Notes', description: 'Anything else' },
    generate: { title: 'Generate Prompt', description: 'Get your Skill' },
  },
  search: 'Search…',
  selected: (n) => `Selected: ${n}`,
  noResults: 'No results',
  errors: { required: 'Required', pickOne: 'Pick at least one' },
  welcome: {
    heading: 'Turn your idea into a professional Skill',
    subheading:
      'Answer 17 simple questions, and we generate a powerful Skill + Cursor Rules + Master Prompt — all locally, with no API key and no conflicts.',
    start: 'Start now →',
    features: [
      '17 organized steps',
      'Smart compatibility',
      'Keyboard shortcuts',
      'No API key',
      'Skill + Cursor + Prompt',
      '23 UI languages',
    ],
    shortcutsLabel: 'Keyboard shortcuts',
    shortcuts: [
      { key: 'Ctrl/⌘ + Enter', action: 'Next step' },
      { key: 'Esc', action: 'Previous step' },
      { key: '1-9', action: 'Quick-select option' },
      { key: 'Arrow keys', action: 'Navigate cards' },
      { key: '/', action: 'Focus search' },
    ],
  },
  compatibility: {
    title: 'Compatibility issues',
    blockers: 'Blocking',
    warnings: 'Warnings',
    info: 'Info',
    autofix: 'Auto-fix',
  },
  generate: {
    heading: 'Prompt ready',
    subheading: 'Three copy-ready formats',
    tabs: { skill: 'Claude Skill', cursor: 'Cursor Rules', prompt: 'Master Prompt' },
    copy: 'Copy',
    copied: 'Copied ✓',
    download: 'Download',
    loading: 'Generating…',
    success: 'Ready',
  },
};

const dict: Record<UiLocale, Translation> = { ar, en };

export function t(locale: UiLocale): Translation {
  return dict[locale];
}

export function isRtl(locale: UiLocale): boolean {
  return locale === 'ar';
}