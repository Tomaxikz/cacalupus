import {
  elementScroll,
  observeElementOffset,
  observeElementRect,
  type PartialKeys,
  type ReactVirtualizer,
  type ReactVirtualizerOptions,
  useWindowVirtualizer,
} from '@tanstack/react-virtual';

type ElementVirtualizerOptions<T extends Element> = PartialKeys<
  ReactVirtualizerOptions<T, T>,
  'observeElementRect' | 'observeElementOffset' | 'scrollToFn'
>;

export function useElementVirtualizer<T extends Element>(
  options: ElementVirtualizerOptions<T>,
): ReactVirtualizer<T, T> {
  return useWindowVirtualizer({
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
    initialOffset: 0,
    ...options,
  } as never) as unknown as ReactVirtualizer<T, T>;
}
