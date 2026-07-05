'use client';
import { useState, useMemo, useEffect } from 'react';
import {
  Copy, Download, CheckCircle2, FileText, Code2, Sparkles, BookOpen,
  AlertCircle, AlertTriangle, Info, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWizard } from '@/components/wizard/context';
import { SkillGenerator } from '@/lib/skill-generator';
import type { ValidationIssue } from '@/lib/validator';
import { t as tr } from '@/lib/i18n';
import { cn } from '@/lib/utils';

type Tab = 'skill' | 'cursor' | 'prompt';

export function GenerateStep() {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const gt = t.generate;
  const [tab, setTab] = useState<Tab>('skill');
  const [copied, setCopied] = useState<Tab | null>(null);

  const generated = useMemo(() => {
    try {
      return new SkillGenerator().generate(wizard.data);
    } catch (e) {
      console.error('Skill generation failed', e);
      return { skill: '', cursor: '', prompt: '', issues: [] as ValidationIssue[] };
    }
  }, [wizard.data]);

  const issues = generated.issues;
  const errCount = issues.filter((i) => i.severity === 'error').length;
  const warnCount = issues.filter((i) => i.severity === 'warning').length;

  const content = generated[tab];

  async function copy(tabId: Tab) {
    try {
      await navigator.clipboard.writeText(generated[tabId]);
      setCopied(tabId);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore
    }
  }

  function download(tabId: Tab) {
    const ext = tabId === 'skill' ? 'md' : tabId === 'cursor' ? 'cursorrules' : 'md';
    const filename =
      tabId === 'cursor'
        ? '.cursorrules'
        : `${(wizard.data.identity.name || 'project').toLowerCase().replace(/\s+/g, '-')}-${tabId}.${ext}`;
    const blob = new Blob([generated[tabId]], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const tabs: { id: Tab; label: string; icon: any; filename: string }[] = [
    { id: 'skill', label: gt.tabs.skill, icon: Sparkles, filename: 'SKILL.md' },
    { id: 'cursor', label: gt.tabs.cursor, icon: Code2, filename: '.cursorrules' },
    { id: 'prompt', label: gt.tabs.prompt, icon: BookOpen, filename: 'PROMPT.md' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className={cn(
          'inline-flex items-center justify-center w-14 h-14 rounded-2xl shadow-xl mb-2',
          errCount === 0
            ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/30'
            : 'bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30',
        )}>
          {errCount === 0 ? (
            <CheckCircle2 className="w-7 h-7 text-white" />
          ) : (
            <ShieldCheck className="w-7 h-7 text-white" />
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold">{gt.heading}</h2>
        <p className="text-sm text-muted-foreground">{gt.subheading}</p>
      </div>

      {/* Validation summary — ZERO contradictions expected after auto-fix */}
      {issues.length > 0 && (
        <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" />
              {wizard.locale === 'ar' ? 'فحص التوافق' : 'Compatibility Check'}
            </p>
            <div className="flex gap-2 text-[11px] font-mono">
              {errCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 text-red-600 dark:text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  {errCount} {wizard.locale === 'ar' ? 'خطأ' : 'errors'}
                </span>
              )}
              {warnCount > 0 && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="h-3 w-3" />
                  {warnCount} {wizard.locale === 'ar' ? 'تحذير' : 'warnings'}
                </span>
              )}
            </div>
          </div>
          <ul className="space-y-1.5 mt-2">
            {issues.map((i, idx) => (
              <li
                key={`${i.category}-${idx}`}
                className={cn(
                  'text-xs leading-relaxed flex items-start gap-2 px-2 py-1.5 rounded-md',
                  i.severity === 'error'
                    ? 'bg-red-500/10 text-red-700 dark:text-red-300'
                    : 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
                )}
              >
                {i.severity === 'error' ? (
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                )}
                <span className="flex-1">{i.message}</span>
                {i.fix && (
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {i.fix}
                  </span>
                )}
              </li>
            ))}
          </ul>
          {errCount === 0 && warnCount === 0 && (
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
              ✨ {wizard.locale === 'ar'
                ? 'المخرج خالٍ من التعارضات — كل الخيارات متناسقة.'
                : 'Output is conflict-free — every selection is consistent.'}
            </p>
          )}
        </div>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="grid grid-cols-3 w-full">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <TabsTrigger key={t.id} value={t.id} className="gap-1.5 text-xs sm:text-sm">
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.label.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {tabs.map((t) => (
          <TabsContent key={t.id} value={t.id} className="space-y-3">
            <div className="flex gap-2 justify-end">
              <Button size="sm" variant="outline" onClick={() => copy(t.id)}>
                {copied === t.id ? (
                  <><CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> {gt.copied}</>
                ) : (
                  <><Copy className="h-3.5 w-3.5" /> {gt.copy}</>
                )}
              </Button>
              <Button size="sm" variant="gradient" onClick={() => download(t.id)}>
                <Download className="h-3.5 w-3.5" /> {gt.download} ({t.filename})
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <pre className="text-xs leading-relaxed p-4 max-h-[600px] overflow-y-auto bg-zinc-950 text-zinc-100 rounded-xl font-mono">
                  {content || '(empty)'}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="rounded-xl border bg-primary/5 p-4 text-sm space-y-1">
        <p className="font-semibold text-primary">
          {wizard.locale === 'ar' ? '🚀 الخطوة التالية:' : '🚀 Next Steps:'}
        </p>
        <ul className="text-muted-foreground space-y-0.5 text-xs">
          <li>• {wizard.locale === 'ar' ? 'انسخ الـ Skill أو حمّله كـ SKILL.md في مجلد .claude/skills/' : 'Copy the Skill or download it as SKILL.md in your .claude/skills/ folder'}</li>
          <li>• {wizard.locale === 'ar' ? 'الصق .cursorrules في جذر مشروعك لـ Cursor' : 'Drop .cursorrules at the root of your Cursor project'}</li>
          <li>• {wizard.locale === 'ar' ? 'استخدم Master Prompt مع أي مساعد AI آخر' : 'Use the Master Prompt with any other AI assistant'}</li>
        </ul>
      </div>
    </div>
  );
}