'use client';
import { CatalogPicker } from '@/components/CatalogPicker';
import { authProviders, socialProviders } from '@/lib/catalog/services';
import { useWizard } from '@/components/wizard/context';
import { StepHeader } from './ProjectTypeStep';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { t as tr } from '@/lib/i18n';
import { filterAuthProviders } from '@/lib/filter';

export function AuthStep() {
  const wizard = useWizard();
  const auth = wizard.data.stack.auth;
  const t = tr(wizard.locale);

  const authFilter = filterAuthProviders(
    authProviders as any,
    wizard.data.stack.frontend,
    wizard.data.stack.database.primary as any,
  );

  return (
    <div className="space-y-6">
      <StepHeader
        title={wizard.locale === 'ar' ? 'المصادقة' : 'Authentication'}
        description={wizard.locale === 'ar' ? 'مزود رئيسي + شبكات اجتماعية + خيارات المؤسسات' : 'Primary provider + social logins + enterprise options'}
      />

      <div>
        <h3 className="text-sm font-semibold mb-3">{wizard.locale === 'ar' ? 'المزود الرئيسي' : 'Primary provider'}</h3>
        <CatalogPicker
          catalog={authFilter.catalog}
          value={auth.primary}
          onChange={(v) => wizard.setStack('auth', { ...auth, primary: v as any })}
          locale={wizard.locale}
          excluded={authFilter.excluded}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-3">
          {wizard.locale === 'ar' ? 'تسجيل الدخول عبر الشبكات الاجتماعية' : 'Social logins'}
        </h3>
        <CatalogPicker
          mode="multi"
          catalog={socialProviders}
          value={auth.socialProviders as any}
          onChange={(v) => wizard.setStack('auth', { ...auth, socialProviders: v as any })}
          locale={wizard.locale}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Toggle
          label={wizard.locale === 'ar' ? 'دعم SSO للمؤسسات' : 'Enterprise SSO'}
          desc={wizard.locale === 'ar' ? 'SAML / OIDC / SCIM' : 'SAML / OIDC / SCIM'}
          checked={auth.enterpriseSso}
          onChange={(c) => wizard.setStack('auth', { ...auth, enterpriseSso: c })}
          locale={wizard.locale}
        />
        <Toggle
          label={wizard.locale === 'ar' ? 'مصادقة ثنائية إلزامية' : 'MFA required'}
          desc={wizard.locale === 'ar' ? 'TOTP / Passkeys / SMS' : 'TOTP / Passkeys / SMS'}
          checked={auth.mfaRequired}
          onChange={(c) => wizard.setStack('auth', { ...auth, mfaRequired: c })}
          locale={wizard.locale}
        />
      </div>
    </div>
  );
}

function Toggle(props: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void; locale: 'ar' | 'en' }) {
  return (
    <label className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 cursor-pointer">
      <Switch checked={props.checked} onCheckedChange={props.onChange} />
      <div>
        <p className="font-medium text-sm">{props.label}</p>
        <p className="text-xs text-muted-foreground">{props.desc}</p>
      </div>
    </label>
  );
}