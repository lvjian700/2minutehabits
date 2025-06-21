import { RefObject, useEffect } from 'react';

export interface ClickOutsideOptions {
  active?: boolean;
  ignoreRefs?: RefObject<HTMLElement>[];
}

export default function useClickOutside(
  ref: RefObject<HTMLElement>,
  handler: () => void,
  { active = true, ignoreRefs = [] }: ClickOutsideOptions = {}
) {
  useEffect(() => {
    if (!active) return;

    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;
      if (!ref.current || ref.current.contains(target)) return;
      if (ignoreRefs.some(r => r.current && r.current.contains(target))) return;
      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler, active, ignoreRefs]);
}
