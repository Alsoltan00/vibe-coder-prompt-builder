'use client';
import { useState } from 'react';
import { Globe, Server, Database, Cloud, Boxes } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CatalogPicker } from '@/components/CatalogPicker';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import {
  frontendHostingCatalog, backendHostingCatalog, databaseHostingCatalog,
  cdnsCatalog, orchestrationCatalog,
} from '@/lib/catalog/infrastructure';
import { filterFrontendHostings, filterBackendHostings } from '@/lib/filter';

type Tab = 'frontend' | 'backend' | 'database' | 'cdn' | 'orchestration';

const TABS: { key: Tab; icon: any; ar: string; en: string; catalog: any[] }[] = [
  { key: 'frontend', icon: Globe, ar: 'الواجهة', en: 'Frontend', catalog: frontendHostingCatalog },
  { key: 'backend', icon: Server, ar: 'الخادم', en: 'Backend', catalog: backendHostingCatalog },
  { key: 'database', icon: Database, ar: 'قاعدة البيانات', en: 'Database', catalog: databaseHostingCatalog },
  { key: 'cdn', icon: Cloud, ar: 'CDN', en: 'CDN', catalog: cdnsCatalog },
  { key: 'orchestration', icon: Boxes, ar: 'التنسيق', en: 'Orchestration', catalog: orchestrationCatalog },
];

export function HostingStep() {
  const wizard = useWizard();
  const [tab, setTab] = useState<Tab>('frontend');
  const h = wizard.data.stack.hosting;

  const current = h[tab] as any;
  const set = (v: any) => wizard.setStack('hosting', { ...h, [tab]: v } as any);

  // Cascading filter — pass data to relevant host filter
  let excluded: Record<string, string> = {};
  if (tab === 'frontend') {
    const f = filterFrontendHostings(frontendHostingCatalog as any, wizard.data.stack.frontend);
    excluded = f.excluded;
  } else if (tab === 'backend') {
    const f = filterBackendHostings(backendHostingCatalog as any, wizard.data.stack.backend, wizard.data.language);
    excluded = f.excluded;
  }

  return (
    <div className="space-y-4">
      <StepHeader
        title={wizard.locale === 'ar' ? 'الاستضافة' : 'Hosting & Infrastructure'}
        description={wizard.locale === 'ar' ? '5 طبقات مستقلة — اختر من كل واحدة' : '5 independent layers — pick from each'}
      />
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        {TABS.map((tb) => {
          const Icon = tb.icon;
          const active = tab === tb.key;
          const hasValue = h[tb.key] !== 'none';
          return (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                active ? 'bg-primary text-primary-foreground border-primary' : hasValue ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-background border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{wizard.locale === 'ar' ? tb.ar : tb.en}</span>
            </button>
          );
        })}
      </div>
      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <CatalogPicker
          catalog={TABS.find((t) => t.key === tab)!.catalog}
          value={current}
          onChange={set}
          locale={wizard.locale}
          excluded={excluded}
        />
      </div>
    </div>
  );
}