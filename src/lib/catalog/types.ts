// =====================================================================
//   Catalog entry shape — used everywhere in the wizard
// =====================================================================

export interface CatalogEntry<TId extends string = string> {
  id: TId;
  name: string;
  nameAr: string;
  category: string;
  categoryAr: string;
  description: string;
  descriptionAr: string;
  pros: string[];
  bestFor: string[];
  version: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  icon: string; // lucide icon name
  // Optional tags used by the compatibility engine
  tags?: string[];
}

export type Difficulty = CatalogEntry['difficulty'];

export function findEntry<TId extends string>(
  catalog: CatalogEntry<TId>[],
  id: TId | '' | null | undefined,
): CatalogEntry<TId> | undefined {
  if (!id) return undefined;
  return catalog.find((e) => e.id === id);
}