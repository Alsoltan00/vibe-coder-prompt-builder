'use client';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { t as tr } from '@/lib/i18n';

// Build marker — bump this string to force a new chunk hash on every deploy.
const AUTOFILL_GUARD_BUILD = 'vcb-guard-v5-noautofill-2026-07-06-defensive';

// Common "ghost" values that browsers / autocomplete libraries try to fill
// into the project-name field. We aggressively clear them on mount and on
// every focus event so the user always sees a truly empty field.
const GHOST_VALUES = [
  'my-project',
  'project name',
  'projectname',
  'untitled',
  'untitled project',
  '',
  ' ',
];

function isGhost(v: string): boolean {
  const norm = v.trim().toLowerCase();
  return GHOST_VALUES.includes(norm);
}

export function IdentityStep() {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const step = t.steps['identity'];

  // Defensive guard: if the value in state is a "ghost" placeholder
  // (because of Firefox/Chrome form history, autofill, or localStorage),
  // force it back to empty so the user types from a clean slate.
  useEffect(() => {
    if (isGhost(wizard.data.identity.name)) {
      wizard.setIdentity({ name: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 max-w-2xl">
      <StepHeader title={step.title} description={step.description} />

      <div className="space-y-2">
        <Label htmlFor="vcb-name-2" className="flex items-center gap-1">
          {wizard.locale === 'ar' ? 'اسم المشروع' : 'Project name'} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="vcb-name-2"
          name="vcb_field_name_v5"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-form-type="other"
          autoFocus
          value={wizard.data.identity.name}
          onChange={(e) => {
            const v = e.target.value;
            // If a browser tries to autofill a ghost value back in, ignore it
            // on the first render; user keystrokes will pass through fine.
            if (isGhost(v)) {
              wizard.setIdentity({ name: '' });
            } else {
              wizard.setIdentity({ name: v });
            }
          }}
          onFocus={(e) => {
            // When the user clicks into the field, clear any ghost value
            if (isGhost(e.currentTarget.value)) {
              e.currentTarget.value = '';
              wizard.setIdentity({ name: '' });
            }
          }}
          placeholder={wizard.locale === 'ar' ? 'مثلاً: متجر سلة' : 'e.g., Smart Cart'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vcb-desc-2" className="flex items-center gap-1">
          {wizard.locale === 'ar' ? 'الوصف' : 'Description'} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="vcb-desc-2"
          name="vcb_field_desc_v5"
          autoComplete="off"
          spellCheck={false}
          data-lpignore="true"
          data-form-type="other"
          rows={5}
          value={wizard.data.identity.description}
          onChange={(e) => wizard.setIdentity({ description: e.target.value })}
          placeholder={wizard.locale === 'ar' ? 'اشرح بإيجاز ماذا يفعل مشروعك وما المشكلة التي يحلّها' : 'Briefly explain what your project does and the problem it solves'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vcb-aud-2">
          {wizard.locale === 'ar' ? 'الجمهور المستهدف' : 'Target audience'}
        </Label>
        <Input
          id="vcb-aud-2"
          name="vcb_field_aud_v5"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-form-type="other"
          value={wizard.data.identity.targetAudience}
          onChange={(e) => wizard.setIdentity({ targetAudience: e.target.value })}
          placeholder={wizard.locale === 'ar' ? 'مثلاً: مطورو البرمجيات، أصحاب المشاريع الصغيرة' : 'e.g., software developers, small business owners'}
        />
      </div>
    </div>
  );
}