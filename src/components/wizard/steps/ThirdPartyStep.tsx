'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import {
  paymentProviders, emailProviders, smsProviders, analyticsProviders,
  monitoringProviders, storageProviders, managedSearchProviders, featureFlagsProviders,
} from '@/lib/catalog/services';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { t as tr } from '@/lib/i18n';
import {
  filterPaymentProviders,
  filterAnalyticsProviders,
  filterStorageProviders,
  filterManagedSearch,
} from '@/lib/filter';

export function ThirdPartyStep() {
  const wizard = useWizard();
  const tp = wizard.data.stack.thirdParty;
  const prof = wizard.data.professionalRequirements;
  const db = wizard.data.stack.database;

  const paymentsFilter = filterPaymentProviders(paymentProviders as any, prof.payments);
  const analyticsFilter = filterAnalyticsProviders(analyticsProviders as any, prof.analytics);
  const storageFilter = filterStorageProviders(storageProviders as any, prof.fileUploads, db.primary as any);
  const managedSearchFilter = filterManagedSearch(managedSearchProviders as any, db.search);

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'الخدمات الخارجية' : 'Third-Party Services'}
        description={wizard.locale === 'ar' ? '8 خدمات مستقلة — كل واحدة تختار منها' : '8 independent services — pick from each'}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'المدفوعات' : 'Payments'}
        catalog={paymentsFilter.catalog}
        value={tp.payments}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, payments: v as any })}
        excluded={paymentsFilter.excluded}
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
        catalog={analyticsFilter.catalog}
        value={tp.analytics}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, analytics: v as any })}
        excluded={analyticsFilter.excluded}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'المراقبة' : 'Monitoring'}
        catalog={monitoringProviders}
        value={tp.monitoring}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, monitoring: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'تخزين الملفات' : 'File storage'}
        catalog={storageFilter.catalog}
        value={tp.storage}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, storage: v as any })}
        excluded={storageFilter.excluded}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'بحث مدار' : 'Managed search'}
        catalog={managedSearchFilter.catalog}
        value={tp.search}
        onChange={(v) => wizard.setStack('thirdParty', { ...tp, search: v as any })}
        excluded={managedSearchFilter.excluded}
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
  excluded?: Record<string, string>;
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
        excluded={props.excluded}
      />
    </div>
  );
}