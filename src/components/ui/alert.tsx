import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'info';
}

const variantStyles: Record<NonNullable<AlertProps['variant']>, string> = {
  default: 'border-border bg-card text-card-foreground',
  info: 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-300',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  warning: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
  destructive: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
};

const variantIcons: Record<NonNullable<AlertProps['variant']>, React.ReactNode> = {
  default: <Info className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <AlertCircle className="h-4 w-4" />,
  destructive: <XCircle className="h-4 w-4" />,
};

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-sm flex items-start gap-3',
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      <div className="shrink-0 mt-0.5">{variantIcons[variant]}</div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn('mb-1 font-medium leading-none tracking-tight', className)} {...props} />;
}

export function AlertDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />;
}