import type { MultiSelectFieldDef } from '@/elements/form-engine/index.ts';
import type { LazyString } from '@/lib/lazy.ts';

interface SearchableResourceLike {
  items: { uuid: string; name: string }[];
  search: string;
  setSearch: (search: string) => void;
  loading: boolean;
}

interface SearchableMultiselectOptions<T extends Record<string, unknown>> {
  name: keyof T & string;
  label: LazyString;
  description?: LazyString;
  resource: SearchableResourceLike;
  canRead?: boolean;
}

export function searchableMultiselectField<T extends Record<string, unknown>>({
  name,
  label,
  description,
  resource,
  canRead = true,
}: SearchableMultiselectOptions<T>): MultiSelectFieldDef<T> {
  return {
    type: 'multiselect',
    name,
    label,
    description,
    options: resource.items.map((item) => ({ label: item.name, value: item.uuid })),
    props: {
      searchable: true,
      searchValue: resource.search,
      onSearchChange: resource.setSearch,
      disabled: !canRead,
      loading: resource.loading,
    },
  };
}
