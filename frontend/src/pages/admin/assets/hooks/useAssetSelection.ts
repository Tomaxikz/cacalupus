import { useCallback, useMemo, useState } from 'react';
import { ObjectSet } from '@/lib/objectSet.ts';
import { StorageAsset } from '@/lib/schemas/admin/assets.ts';

export type AssetSet = ObjectSet<StorageAsset, 'name'>;

export function emptyAssetSet(entries?: StorageAsset[]): AssetSet {
  return new ObjectSet<StorageAsset, 'name'>('name', entries);
}

export function useAssetSelection(assets: StorageAsset[] | undefined) {
  const [selected, setSelected] = useState<AssetSet>(() => emptyAssetSet());

  const selectableAssets = useMemo(() => (assets ?? []).filter((asset) => !asset.isDirectory), [assets]);

  const clear = useCallback(() => setSelected(emptyAssetSet()), []);

  const add = useCallback((asset: StorageAsset) => {
    if (asset.isDirectory) return;
    setSelected((prev) => prev.clone().add(asset));
  }, []);

  const remove = useCallback((asset: StorageAsset) => {
    setSelected((prev) => {
      const next = prev.clone();
      next.delete(asset);
      return next;
    });
  }, []);

  const toggle = useCallback((asset: StorageAsset) => {
    if (asset.isDirectory) return;
    setSelected((prev) => {
      const next = prev.clone();
      if (next.has(asset)) {
        next.delete(asset);
      } else {
        next.add(asset);
      }
      return next;
    });
  }, []);

  const replace = useCallback((next: StorageAsset[]) => {
    setSelected(emptyAssetSet(next.filter((asset) => !asset.isDirectory)));
  }, []);

  const selectAll = useCallback(() => setSelected(emptyAssetSet(selectableAssets)), [selectableAssets]);

  return { selected, selectableAssets, clear, add, remove, toggle, replace, selectAll };
}
