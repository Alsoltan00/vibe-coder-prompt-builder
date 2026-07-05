'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import {
  paymentProviders, emailProviders, smsProviders, analyticsProviders,
  monitoringProviders, storageProviders, managedSearchProviders, featureFlagsProviders,
} from '@/lib/catalog/services';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { t as tr } from '@/lib/i18n';

export function ThirdPartyStep() {
  const wizard = useWizard();
  const tp = wizard.data.stack.thirdParty;
  const t = tr(wizard.locale);

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'الخدمات الخارجية' : 'Third-Party Services'}
        description={wizard.locale === 'ar' ? '8 خدمات مستقلة — كل واحدة تختار منها' : '8 independent services — pick from each'}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'المدفوعات' : 'Payments'}
        catalog={paymentProviders}
        value={tp.payments}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, payments: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}
        catalog={emailProviders}
        value={tp.email}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, email: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'الرسائل القصيرة' : 'SMS'}
        catalog={smsProviders}
        value={tp.sms}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, sms: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'تحليلات الاستخدام' : 'Analytics'}
        catalog={analyticsProviders}
        value={tp.analytics}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, analytics: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'المراقبة' : 'Monitoring'}
        catalog={monitoringProviders}
        value={tp.monitoring}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, monitoring: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'تخزين الملفات' : 'File storage'}
        catalog={storageProviders}
        value={tp.storage}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, storage: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'بحث مدار' : 'Managed search'}
        catalog={managedSearchProviders}
        value={tp.search}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, search: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'أعلام الميزات' : 'Feature flags'}
        catalog={featureFlagsProviders}
        value={tp.featureFlags}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, featureFlags: v as any })}
      />
    </div>
  );
}

function Sub<TId extends string>(props: {
  title: string;
  catalog: any[];
  value: TId | '' | TId[];
  onChange: (v: TId | '' | TId[]) => void;
}) {
  const wizard = useWizard();
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{props.title}</h3>
      <CatalogPicker
        catalog={props.catalog}
        value={props.value}
        onChange={props.onChange}
        locale={wizard.locale}
      />
    </div>
  );
}