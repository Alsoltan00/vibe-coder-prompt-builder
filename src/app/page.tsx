'use client';
import dynamic from 'next/dynamic';

const WizardPage = dynamic(() => import('@/components/wizard/Wizard').then((m) => m.default), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  ),
});

export default function Page() {
  return <WizardPage />;
}