import { useEffect } from "react";

export default function useClickOutside(
  ref,
  handler,
  { active = true, ignoreRefs = [] } = {},
) {
  useEffect(() => {
    if (!active) return;

    const listener = (event) => {
      const target = event.target;
      if (!ref.current || ref.current.contains(target)) return;
      if (ignoreRefs.some((r) => r.current && r.current.contains(target)))
        return;
      handler();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, active, ignoreRefs]);
}
