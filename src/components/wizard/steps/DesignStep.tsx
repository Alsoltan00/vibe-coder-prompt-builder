'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import { cssFrameworks, componentLibraries, iconSets, fontFamilies } from '@/lib/catalog/services';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { Switch } from '@/components/ui/switch';

export function DesignStep() {
  const wizard = useWizard();
  const d = wizard.data.stack.design;

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'نظام التصميم' : 'Design System'}
        description={wizard.locale === 'ar' ? '4 طبقات + Design Tokens' : '4 layers + Design Tokens'}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'إطار CSS' : 'CSS framework'}
        catalog={cssFrameworks}
        value={d.cssFramework}
        onChange={(v) => wizard.setStack('design', { ...d, cssFramework: v as any })}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'مكتبة المكونات' : 'Component library'}
        catalog={componentLibraries}
        value={d.componentLibrary}
        onChange={(v) => wizard.setStack('design', { ...d, componentLibrary: v as any })}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'مجموعة الأيقونات' : 'Icon set'}
        catalog={iconSets}
        value={d.iconSet}
        onChange={(v) => wizard.setStack('design', { ...d, iconSet: v as any })}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'الخط' : 'Primary font'}
        catalog={fontFamilies}
        value={d.fontFamily}
        onChange={(v) => wizard.setStack('design', { ...d, fontFamily: v as any })}
      />
      <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer">
        <Switch
          checked={d.designTokens}
          onCheckedChange={(c) => wizard.setStack('design', { ...d, designTokens: c })}
        />
        <div>
          <p className="font-medium text-sm">
            {wizard.locale === 'ar' ? 'Design Tokens' : 'Design Tokens'}
          </p>
          <p className="text-xs text-muted-foreground">
            {wizard.locale === 'ar' ? 'متغيرات CSS مركزية' : 'Centralized CSS variables'}
          </p>
        </div>
      </label>
    </div>
  );
}

function SubSection<TId extends string>(props: {
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