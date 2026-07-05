'use client';
import { useState } from 'react';
import { Database, Layers, Zap, Search, BarChart3, Network, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CatalogPicker } from '@/components/CatalogPicker';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import {
  primaryDatabases, cacheDatabases, vectorDatabases, searchDatabases,
  analyticsDatabases, graphDatabases, timeSeriesDatabases,
} from '@/lib/catalog/infrastructure';
import { t as tr } from '@/lib/i18n';
import { filterVectorDatabases, filterTimeSeriesDatabases } from '@/lib/filter';

type Tab = 'primary' | 'cache' | 'vector' | 'search' | 'analytics' | 'graph' | 'timeseries';

const TABS: { key: Tab; icon: typeof Database; ar: string; en: string; category: string }[] = [
  { key: 'primary', icon: Database, ar: 'رئيسية (OLTP)', en: 'Primary (OLTP)', category: 'primaryDatabases' },
  { key: 'cache', icon: Zap, ar: 'تخزين مؤقت', en: 'Cache / KV', category: 'cacheDatabases' },
  { key: 'vector', icon: Layers, ar: 'متجهات (AI)', en: 'Vector (AI)', category: 'vectorDatabases' },
  { key: 'search', icon: Search, ar: 'محرك بحث', en: 'Search Engine', category: 'searchDatabases' },
  { key: 'analytics', icon: BarChart3, ar: 'تحليلات', en: 'Analytics (OLAP)', category: 'analyticsDatabases' },
  { key: 'graph', icon: Network, ar: 'رسوم بيانية', en: 'Graph DB', category: 'graphDatabases' },
  { key: 'timeseries', icon: Activity, ar: 'سلاسل زمنية', en: 'Time-series', category: 'timeSeriesDatabases' },
];

const CATALOGS: Record<Tab, any[]> = {
  primary: primaryDatabases,
  cache: cacheDatabases,
  vector: vectorDatabases,
  search: searchDatabases,
  analytics: analyticsDatabases,
  graph: graphDatabases,
  timeseries: timeSeriesDatabases,
};

export function DatabaseStep() {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const [tab, setTab] = useState<Tab>('primary');
  const db = wizard.data.stack.database;

  const currentValue = db[tab] as any;
  const setValue = (v: any) =>
    wizard.setStack('database', { ...db, [tab]: v } as any);

  const activeTab = TABS.find((t) => t.key === tab)!;

  // Apply cascading filters from compatibility engine
  const excluded: Record<string, string> = {};
  if (tab === 'vector') {
    const f = filterVectorDatabases(vectorDatabases as any, db.primary);
    Object.assign(excluded, f.excluded);
  } else if (tab === 'timeseries') {
    const f = filterTimeSeriesDatabases(timeSeriesDatabases as any, db.primary);
    Object.assign(excluded, f.excluded);
  }

  return (
    <div className="space-y-4">
      <StepHeader
        title={t.steps['database'].title}
        description={t.steps['database'].description}
      />

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1">
        {TABS.map((tb) => {
          const Icon = tb.icon;
          const active = tab === tb.key;
          const hasValue = db[tb.key] !== 'none';
          return (
            <button
              key={tb.key}
              onClick={() => setTab(tb.key)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
                active
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : hasValue
                    ? 'bg-primary/10 border-primary/40 text-primary'
                    : 'bg-background hover:bg-muted border-border text-muted-foreground',
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">
                {wizard.locale === 'ar' ? tb.ar : tb.en}
              </span>
              {hasValue && !active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <CatalogPicker
          catalog={CATALOGS[tab]}
          value={currentValue}
          onChange={(v) => setValue(v)}
          locale={wizard.locale}
          excluded={excluded}
        />
      </div>
    </div>
  );
}