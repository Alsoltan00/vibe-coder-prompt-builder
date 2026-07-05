'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import { ciProviders, cdStrategies, iacTools, packageManagers, monorepoTools } from '@/lib/catalog/services';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';

export function DevOpsStep() {
  const wizard = useWizard();
  const d = wizard.data.stack.devops;

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'CI/CD و DevOps' : 'CI/CD & DevOps'}
        description={wizard.locale === 'ar' ? '5 طبقات — CI/CD/IaC/PackageMgr/Monorepo' : '5 layers — CI/CD/IaC/PackageMgr/Monorepo'}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'التكامل المستمر (CI)' : 'Continuous Integration (CI)'}
        catalog={ciProviders}
        value={d.ci}
        onChange={(v) => wizard.setStack('devops', { ...d, ci: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'النشر المستمر (CD)' : 'Continuous Deployment (CD)'}
        catalog={cdStrategies}
        value={d.cd}
        onChange={(v) => wizard.setStack('devops', { ...d, cd: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'البنية ككود (IaC)' : 'Infrastructure as Code (IaC)'}
        catalog={iacTools}
        value={d.iac}
        onChange={(v) => wizard.setStack('devops', { ...d, iac: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'مدير الحزم' : 'Package Manager'}
        catalog={packageManagers}
        value={d.packageManager}
        onChange={(v) => wizard.setStack('devops', { ...d, packageManager: v as any })}
      />
      <Sub
        title={wizard.locale === 'ar' ? 'أداة المونوريبو' : 'Monorepo Tool'}
        catalog={monorepoTools}
        value={d.monorepo}
        onChange={(v) => wizard.setStack('devops', { ...d, monorepo: v as any })}
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