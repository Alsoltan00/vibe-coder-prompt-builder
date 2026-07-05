'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { t as tr } from '@/lib/i18n';

export function IdentityStep() {
  const wizard = useWizard();
  const t = tr(wizard.locale);
  const step = t.steps['identity'];

  return (
    <div className="space-y-6 max-w-2xl">
      <StepHeader title={step.title} description={step.description} />

      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-1">
          {wizard.locale === 'ar' ? 'اسم المشروع' : 'Project name'} <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          autoFocus
          value={wizard.data.identity.name}
          onChange={(e) => wizard.setIdentity({ name: e.target.value })}
          placeholder={wizard.locale === 'ar' ? 'مثلاً: متجر سلة' : 'e.g., Smart Cart'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="desc" className="flex items-center gap-1">
          {wizard.locale === 'ar' ? 'الوصف' : 'Description'} <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="desc"
          rows={5}
          value={wizard.data.identity.description}
          onChange={(e) => wizard.setIdentity({ description: e.target.value })}
          placeholder={wizard.locale === 'ar' ? 'اشرح بإيجاز ماذا يفعل مشروعك وما المشكلة التي يحلّها' : 'Briefly explain what your project does and the problem it solves'}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="aud">
          {wizard.locale === 'ar' ? 'الجمهور المستهدف' : 'Target audience'}
        </Label>
        <Input
          id="aud"
          value={wizard.data.identity.targetAudience}
          onChange={(e) => wizard.setIdentity({ targetAudience: e.target.value })}
          placeholder={wizard.locale === 'ar' ? 'مثلاً: مطورو البرمجيات، أصحاب المشاريع الصغيرة' : 'e.g., software developers, small business owners'}
        />
      </div>
    </div>
  );
}