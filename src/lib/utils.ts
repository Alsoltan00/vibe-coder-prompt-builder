import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function formatDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function orUndef<T>(v: T | '' | null | undefined): T | undefined {
  return v === '' || v == null ? undefined : v;
}