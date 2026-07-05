'use client';
import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CatalogPicker } from '@/components/CatalogPicker';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { Switch } from '@/components/ui/switch';
import { locales, translationSources } from '@/lib/catalog/services';

export function I18nStep() {
  const wizard = useWizard();
  const i = wizard.data.stack.i18n;

  function toggleLocale(id: any) {
    const has = i.supportedLocales.includes(id);
    let next = has ? i.supportedLocales.filter((x) => x !== id) : [...i.supportedLocales, id];
    if (!next.includes(i.defaultLocale)) next = [i.defaultLocale, ...next];
    wizard.setStack('i18n', { ...i, supportedLocales: next });
  }

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'تعدد اللغات' : 'Internationalization'}
        description={wizard.locale === 'ar' ? `${locales.length} لغة متاحة • ${locales.filter(l => l.direction === 'rtl').length} RTL` : `${locales.length} languages • ${locales.filter(l => l.direction === 'rtl').length} RTL`}
      />

      <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer">
        <Switch
          checked={i.enabled}
          onCheckedChange={(c) => wizard.setStack('i18n', { ...i, enabled: c })}
        />
        <div>
          <p className="font-medium text-sm">
            {wizard.locale === 'ar' ? 'تفعيل دعم اللغات' : 'Enable i18n'}
          </p>
          <p className="text-xs text-muted-foreground">
            {wizard.locale === 'ar' ? 'سيتم توليد هيكل i18n كامل' : 'Full i18n structure will be generated'}
          </p>
        </div>
      </label>

      {i.enabled && (
        <>
          <div>
            <h3 className="text-sm font-semibold mb-3">{wizard.locale === 'ar' ? 'اللغة الافتراضية' : 'Default locale'}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {locales.map((l) => {
                const active = i.defaultLocale === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => {
                      if (!i.supportedLocales.includes(l.id)) {
                        wizard.setStack('i18n', { ...i, defaultLocale: l.id, supportedLocales: [l.id, ...i.supportedLocales] });
                      } else {
                        wizard.setStack('i18n', { ...i, defaultLocale: l.id });
                      }
                    }}
                    className={cn(
                      'p-2.5 rounded-lg border text-center transition-all',
                      active ? 'border-primary bg-primary/10 ring-1 ring-primary' : 'bg-card hover:border-primary/50',
                    )}
                  >
                    <div className="text-[10px] text-muted-foreground">{l.direction === 'rtl' ? '↩' : '→'}</div>
                    <div className="font-semibold text-sm truncate">{l.nativeName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">
              {wizard.locale === 'ar' ? 'اللغات المدعومة' : 'Supported locales'}{' '}
              <span className="text-primary">({i.supportedLocales.length})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {locales.map((l) => {
                const sel = i.supportedLocales.includes(l.id);
                const isDefault = i.defaultLocale === l.id;
                return (
                  <button
                    key={l.id}
                    disabled={isDefault}
                    onClick={() => !isDefault && toggleLocale(l.id)}
                    className={cn(
                      'p-2.5 rounded-lg border text-center transition-all relative',
                      sel ? 'border-pink-500 bg-pink-500/10' : 'bg-card hover:border-primary/50',
                      isDefault && 'opacity-70 cursor-not-allowed',
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">{l.direction === 'rtl' ? '↩' : '→'}</span>
                      {sel && <Check className="h-3 w-3 text-pink-500" />}
                    </div>
                    <div className="font-semibold text-sm truncate">{l.nativeName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer">
            <Switch
              checked={i.rtlSupport}
              onCheckedChange={(c) => wizard.setStack('i18n', { ...i, rtlSupport: c })}
            />
            <div>
              <p className="font-medium text-sm">
                {wizard.locale === 'ar' ? 'دعم RTL' : 'Enable RTL'}
              </p>
              <p className="text-xs text-muted-foreground">
                {wizard.locale === 'ar' ? 'تطبيق تلقائي للغات RTL' : 'Auto-apply for RTL languages'}
              </p>
            </div>
          </label>

          <div>
            <h3 className="text-sm font-semibold mb-3">{wizard.locale === 'ar' ? 'مصدر الترجمات' : 'Translation source'}</h3>
            <CatalogPicker
              catalog={translationSources}
              value={i.translationSource}
              onChange={(v) => wizard.setStack('i18n', { ...i, translationSource: v as any })}
              locale={wizard.locale}
            />
          </div>
        </>
      )}
    </div>
  );
}