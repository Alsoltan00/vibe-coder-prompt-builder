'use client';
import { Shield, Users, Smartphone, Zap, Upload, CreditCard, Search, BarChart, Globe } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';

const FLAGS = [
  { key: 'userAccounts', icon: Users, ar: 'حسابات المستخدمين', en: 'User Accounts' },
  { key: 'sensitiveData', icon: Shield, ar: 'بيانات حساسة', en: 'Sensitive Data' },
  { key: 'adminPanel', icon: BarChart, ar: 'لوحة إدارة', en: 'Admin Panel' },
  { key: 'mobileResponsive', icon: Smartphone, ar: 'تصميم متجاوب', en: 'Mobile Responsive' },
  { key: 'realTimeFeatures', icon: Zap, ar: 'ميزات فورية', en: 'Real-Time' },
  { key: 'fileUploads', icon: Upload, ar: 'رفع ملفات', en: 'File Uploads' },
  { key: 'payments', icon: CreditCard, ar: 'مدفوعات', en: 'Payments' },
  { key: 'searchFeature', icon: Search, ar: 'بحث متقدم', en: 'Advanced Search' },
  { key: 'analytics', icon: BarChart, ar: 'تحليلات', en: 'Analytics' },
  { key: 'multiLanguage', icon: Globe, ar: 'تعدد اللغات', en: 'Multi-Language' },
] as const;

export function ProfessionalStep() {
  const wizard = useWizard();
  const pr = wizard.data.professionalRequirements;
  const selectedCount = Object.values(pr).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <StepHeader
        title={wizard.locale === 'ar' ? 'ميزات احترافية' : 'Professional Features'}
        description={wizard.locale === 'ar' ? `${selectedCount} من 10 مختارة` : `${selectedCount} of 10 selected`}
      />
      <div className="grid sm:grid-cols-2 gap-3">
        {FLAGS.map((f) => {
          const Icon = f.icon;
          const active = pr[f.key];
          return (
            <label
              key={f.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                active ? 'bg-primary/5 border-primary' : 'bg-card hover:bg-muted/50'
              }`}
            >
              <Icon className={`h-5 w-5 shrink-0 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="flex-1 text-sm font-medium">{wizard.locale === 'ar' ? f.ar : f.en}</span>
              <Switch
                checked={active}
                onCheckedChange={(c) =>
                  wizard.setProfessionalReqs({ ...pr, [f.key]: c })
                }
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}