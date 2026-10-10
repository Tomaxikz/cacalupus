import { RefObject, useEffect } from 'react';
import { visualViewportBottomInset } from '@/plugins/viewport/useVisualViewport.ts';

interface UseContainerAutoHeightOptions {
  containerRef: RefObject<HTMLDivElement | null>;
  loading: boolean;
  getParent: () => HTMLElement | null | undefined;
  layout: () => void;
  extraObserveRef?: RefObject<HTMLDivElement | null>;
  useVisualViewportInset?: boolean;
  /** Leave room for the layout footer and any page content below the container. */
  aboveFooter?: boolean;
  /** Set this custom property to the measured height instead of sizing the element itself. */
  cssVariable?: string;
  deps: unknown[];
}

export function useContainerAutoHeight({
  containerRef,
  loading,
  getParent,
  layout,
  extraObserveRef,
  useVisualViewportInset = false,
  aboveFooter = false,
  cssVariable,
  deps,
}: UseContainerAutoHeightOptions) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el || loading) return;

    const layoutRoot = aboveFooter ? el.closest('[data-layout-container]') : null;
    const layoutContent = layoutRoot?.querySelector<HTMLElement>(':scope > [data-layout-content]') ?? null;
    const layoutFooter = layoutRoot?.querySelector<HTMLElement>(':scope > [data-layout-footer]') ?? null;

    const reservedBelow = (elRect: DOMRect) => {
      let reserved = 0;

      if (layoutFooter) {
        const style = getComputedStyle(layoutFooter);
        reserved +=
          layoutFooter.getBoundingClientRect().height + parseFloat(style.marginTop) + parseFloat(style.marginBottom);
      }

      if (layoutContent) {
        reserved += Math.max(0, layoutContent.getBoundingClientRect().bottom - elRect.bottom);
      }

      return reserved;
    };

    const updateHeight = () => {
      const virtualWindowEl = getParent();
      const elRect = el.getBoundingClientRect();

      let bottomEdge: number;
      if (useVisualViewportInset) {
        const visibleBottom = window.innerHeight - visualViewportBottomInset();
        bottomEdge = virtualWindowEl
          ? Math.min(virtualWindowEl.getBoundingClientRect().bottom, visibleBottom)
          : visibleBottom;
      } else {
        bottomEdge = virtualWindowEl ? virtualWindowEl.getBoundingClientRect().bottom : window.innerHeight;
      }

      const newHeight = Math.max(0, bottomEdge - reservedBelow(elRect) - elRect.top);
      if (cssVariable) el.style.setProperty(cssVariable, `${newHeight}px`);
      else el.style.height = `${newHeight}px`;

      layout();
    };

    const observer = new ResizeObserver(() => updateHeight());

    const viewport = useVisualViewportInset ? window.visualViewport : null;
    viewport?.addEventListener('resize', updateHeight);
    viewport?.addEventListener('scroll', updateHeight);

    const virtualWindowEl = getParent();
    if (virtualWindowEl) {
      observer.observe(virtualWindowEl);
    } else {
      observer.observe(document.body);
    }

    for (const element of [layoutContent, layoutFooter]) {
      if (element) observer.observe(element);
    }

    if (extraObserveRef?.current) {
      observer.observe(extraObserveRef.current);
    }

    updateHeight();

    return () => {
      observer.disconnect();
      viewport?.removeEventListener('resize', updateHeight);
      viewport?.removeEventListener('scroll', updateHeight);
    };
  }, deps);
}
