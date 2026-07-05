'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import { unitTestTools, componentTestTools, e2eTestTools, apiTestTools } from '@/lib/catalog/services';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { filterE2eTests } from '@/lib/filter';

export function TestingStep() {
  const wizard = useWizard();
  const t = wizard.data.stack.testing;
  const prof = wizard.data.professionalRequirements;

  const e2eFilter = filterE2eTests(e2eTestTools as any, prof.payments, prof.userAccounts);

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'الاختبارات' : 'Testing'}
        description={wizard.locale === 'ar' ? '4 طبقات + 3 خيارات متقدمة' : '4 layers + 3 advanced toggles'}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'اختبار الوحدات' : 'Unit testing'}
        catalog={unitTestTools}
        value={t.unit}
        onChange={(v) => wizard.setStack('testing', { ...t, unit: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'اختبار المكونات' : 'Component testing'}
        catalog={componentTestTools}
        value={t.component}
        onChange={(v) => wizard.setStack('testing', { ...t, component: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'الاختبار الشامل (E2E)' : 'E2E testing'}
        catalog={e2eFilter.catalog}
        value={t.e2e}
        onChange={(v) => wizard.setStack('testing', { ...t, e2e: v as any })}
        excluded={e2eFilter.excluded}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'اختبار API' : 'API testing'}
        catalog={apiTestTools}
        value={t.api}
        onChange={(v) => wizard.setStack('testing', { ...t, api: v as any })}
      />

      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle
          label={wizard.locale === 'ar' ? 'انحدار بصري' : 'Visual regression'}
          checked={t.visualRegression}
          onChange={(c) => wizard.setStack('testing', { ...t, visualRegression: c })}
          locale={wizard.locale}
        />
        <Toggle
          label={wizard.locale === 'ar' ? 'اختبار الحمل' : 'Load testing'}
          checked={t.loadTesting}
          onChange={(c) => wizard.setStack('testing', { ...t, loadTesting: c })}
          locale={wizard.locale}
        />
        <Toggle
          label={wizard.locale === 'ar' ? 'فحص أمني' : 'Security scanning'}
          checked={t.securityScanning}
          onChange={(c) => wizard.setStack('testing', { ...t, securityScanning: c })}
          locale={wizard.locale}
        />
        <div className="p-3 rounded-lg border bg-card space-y-1.5">
          <Label className="text-sm">
            {wizard.locale === 'ar' ? 'هدف التغطية' : 'Coverage target'}:{' '}
            <span className="text-primary font-mono">{t.coverageTarget}%</span>
          </Label>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={t.coverageTarget}
            onChange={(e) => wizard.setStack('testing', { ...t, coverageTarget: Number(e.target.value) })}
            className="w-full accent-violet-600"
          />
        </div>
      </div>
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

function Toggle(props: { label: string; checked: boolean; onChange: (v: boolean) => void; locale: 'ar' | 'en' }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer">
      <Switch checked={props.checked} onCheckedChange={props.onChange} />
      <p className="font-medium text-sm pt-0.5">{props.label}</p>
    </label>
  );
}