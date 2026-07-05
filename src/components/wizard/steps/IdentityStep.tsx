'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { t as tr } from '@/lib/i18n';

// Build marker — bump this string to force a new chunk hash on every deploy.
const AUTOFILL_GUARD_BUILD = 'vcb-guard-v4-noautofill-2026-07-06';

if (typeof window !== 'undefined') {
  // Confirms in browser console that the new chunk is loaded
  console.log('%c[VCB]', 'color:#7c3aed;font-weight:bold', 'autofill-guard v4 active');
}

export function IdentityStep() {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const step = t.steps['identity'];

  // Every input has explicit autocomplete=off + unique name + data-lpignore
  // so Firefox form history, LastPass / 1Password, and password managers
  // don't autofill anything from previous visits.

  return (
    <div className="space-y-6 max-w-2xl">
      <StepHeader title={step.title} description={step.description} />

      <div className="space-y-2">
        <Label htmlFor="vcb-name" className="flex items-center gap-1">
          {wizard.locale === 'ar' ? 'اسم المشروع' : 'Project name'} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="vcb-name"
          name="vcb_field_name"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          data-lpignore="true"
          data-form-type="other"
          autoFocus
          value={wizard.data.identity.name}
          onChange={(e) => wizard.setIdentity({ name: e.target.value })}
          placeholder={wizard.locale === 'ar' ? 'مثلاً: متجر سلة' : 'e.g., Smart Cart'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vcb-desc" className="flex items-center gap-1">
          {wizard.locale === 'ar' ? 'الوصف' : 'Description'} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="vcb-desc"
          name="vcb_field_desc"
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
        <Label htmlFor="vcb-aud">
          {wizard.locale === 'ar' ? 'الجمهور المستهدف' : 'Target audience'}
        </Label>
        <Input
          id="vcb-aud"
          name="vcb_field_aud"
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