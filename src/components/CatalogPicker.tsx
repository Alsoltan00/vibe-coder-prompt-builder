'use client';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { CatalogEntry } from '@/lib/catalog/types';
import type { UiLocale } from '@/types';
import { t as tr } from '@/lib/i18n';

interface CatalogPickerProps<TId extends string> {
  catalog: CatalogEntry<TId>[];
  value: TId | '' | TId[];
  onChange: (v: TId | '' | TId[]) => void;
  mode?: 'single' | 'multi';
  locale: UiLocale;
  groupByCategory?: boolean;
  className?: string;
  /**
   * Map of option id → reason it was excluded by the compatibility engine.
   * Excluded options remain visible (with a tooltip explaining why) so the
   * user understands the constraint instead of seeing the option silently
   * disappear. Click is a no-op.
   */
  excluded?: Record<string, string>;
}

export function CatalogPicker<TId extends string>({
  catalog,
  value,
  onChange,
  mode = 'single',
  locale,
  groupByCategory = true,
  className,
  excluded,
}: CatalogPickerProps<TId>) {
  const t = tr(locale);
  const [query, setQuery] = useState('');
  const [focusedIdx, setFocusedIdx] = useState(0);

  const isMulti = mode === 'multi';
  const selectedIds = isMulti
    ? (value as TId[])
    : value
      ? [(value as TId)]
      : [];

  // Filter
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return catalog;
    return catalog.filter((e) =>
      [e.name, e.nameAr, e.description, e.descriptionAr, e.category, e.categoryAr, ...(e.pros ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q),
    );
  }, [catalog, query]);

  // Group
  const grouped = React.useMemo(() => {
    if (!groupByCategory) return { '': filtered };
    const groups: Record<string, CatalogEntry<TId>[]> = {};
    for (const e of filtered) {
      const k = locale === 'ar' ? e.categoryAr : e.category;
      (groups[k] ||= []).push(e);
    }
    return groups;
  }, [filtered, groupByCategory, locale]);

  const flatList: CatalogEntry<TId>[] = React.useMemo(() => Object.values(grouped).flat(), [grouped]);

  // Reset focused index when list changes
  useEffect(() => setFocusedIdx(0), [query, mode, groupByCategory]);

  function toggle(id: TId) {
    if (isMulti) {
      const arr = (value as TId[]) ?? [];
      onChange(arr.includes(id) ? (arr.filter((x) => x !== id) as TId[]) : ([...arr, id] as TId[]));
    } else {
      onChange(((value as TId | '') === id ? '' : id) as TId | '');
    }
  }

  // Keyboard nav
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!flatList.length) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((i) => Math.min(i + 1, flatList.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle(flatList[focusedIdx]!.id);
    } else if (/^[1-9]$/.test(e.key) && isMulti === false) {
      const idx = Number(e.key) - 1;
      if (flatList[idx]) toggle(flatList[idx]!.id);
    }
  }

  const Icon = ({ name }: { name: string }) => {
    const Cmp = (Icons as any)[name] || Icons.Box;
    return <Cmp className="h-4 w-4" />;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search */}
      <div className="relative">
        <Icons.Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={t.search + ' ( / to focus, ↑↓ Enter, 1-9 )'}
          className="ps-10 h-11"
        />
      </div>

      <div className="text-xs text-muted-foreground flex justify-between">
        <span>{t.selected(selectedIds.length)}</span>
        <span className="hidden sm:inline">↑↓ to navigate, Enter to select</span>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
          {t.noResults}
        </div>
      )}

      <div className="space-y-6">
        {Object.entries(grouped).map(([catName, entries], gIdx) => (
          <div key={catName}>
            {catName && (
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {catName}
              </h3>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {entries.map((entry, eIdx) => {
                const idx = flatList.indexOf(entry);
                const selected = selectedIds.includes(entry.id);
                const focused = idx === focusedIdx;
                const isExcluded = excluded?.[entry.id];
                const excludedReason = isExcluded ?? '';
                const interactive = !isExcluded;
                return (
                  <Card
                    key={entry.id}
                    onClick={() => interactive && toggle(entry.id)}
                    onMouseEnter={() => setFocusedIdx(idx)}
                    title={excludedReason || undefined}
                    aria-disabled={!!isExcluded}
                    className={cn(
                      'transition-all select-none',
                      interactive ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                      selected && interactive
                        ? 'ring-2 ring-primary border-primary bg-primary/5'
                        : focused && interactive
                          ? 'ring-2 ring-primary/40 border-primary/40'
                          : interactive
                            ? 'hover:border-primary/40 hover:bg-muted/50'
                            : 'border-dashed',
                    )}
                  >
                    <CardContent className="p-3 flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                          selected && interactive
                            ? 'bg-primary text-primary-foreground'
                            : isExcluded
                              ? 'bg-muted/60 text-muted-foreground/60'
                              : 'bg-muted text-muted-foreground',
                        )}
                      >
                        <Icon name={entry.icon} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={cn('font-semibold truncate text-sm', selected && interactive && 'text-primary')}>
                            {locale === 'ar' ? entry.nameAr : entry.name}
                          </p>
                          {isExcluded && (
                            <Icons.Lock className="h-3 w-3 text-muted-foreground shrink-0" />
                          )}
                          {isMulti && interactive && !isExcluded && (
                            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                              {entries.indexOf(entry) + 1}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-tight">
                          {locale === 'ar' ? entry.descriptionAr : entry.description}
                        </p>
                        {isExcluded && (
                          <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 leading-snug">
                            {excludedReason}
                          </p>
                        )}
                        <div className="flex items-center gap-1 mt-1.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {entry.version}
                          </Badge>
                          {selected && interactive && (
                            <Icons.Check className="h-3 w-3 text-primary ms-auto" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}