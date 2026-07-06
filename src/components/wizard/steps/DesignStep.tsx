'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { Switch } from '@/components/ui/switch';
import { cssFrameworks, componentLibraries, iconSets, fontFamilies } from '@/lib/catalog/services';
import { filterDesignOptions } from '@/lib/filter';

export function DesignStep() {
  const wizard = useWizard();
  const d = wizard.data.stack.design;
  const frontend = wizard.data.stack.frontend;

  const cssFilter = filterDesignOptions(cssFrameworks as any, frontend);
  const compFilter = filterDesignOptions(componentLibraries as any, frontend);
  const iconFilter = filterDesignOptions(iconSets as any, frontend);
  const fontFilter = filterDesignOptions(fontFamilies as any, frontend);

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'نظام التصميم' : 'Design System'}
        description={wizard.locale === 'ar' ? '4 طبقات + Design Tokens' : '4 layers + Design Tokens'}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'إطار عمل CSS' : 'CSS Framework'}
        catalog={cssFilter.catalog}
        value={d.cssFramework}
        onChange={(v) => wizard.setStack('design', { ...d, cssFramework: v as any })}
        excluded={cssFilter.excluded}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'مكتبة المكونات' : 'Component Library'}
        catalog={compFilter.catalog}
        value={d.componentLibrary}
        onChange={(v) => wizard.setStack('design', { ...d, componentLibrary: v as any })}
        excluded={compFilter.excluded}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'مجموعة الأيقونات' : 'Icon Set'}
        catalog={iconFilter.catalog}
        value={d.iconSet}
        onChange={(v) => wizard.setStack('design', { ...d, iconSet: v as any })}
        excluded={iconFilter.excluded}
      />
      <SubSection
        title={wizard.locale === 'ar' ? 'عائلة الخطوط' : 'Font Family'}
        catalog={fontFilter.catalog}
        value={d.fontFamily}
        onChange={(v) => wizard.setStack('design', { ...d, fontFamily: v as any })}
        excluded={fontFilter.excluded}
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