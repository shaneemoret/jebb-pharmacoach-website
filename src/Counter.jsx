import { useEffect, useRef, useState } from "react";

// Counts a figure up once it scrolls into view. The prefix and suffix are kept
// verbatim so "$124,600" and "83 days" read correctly the whole way up.
export function Counter({ value }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(null);

  const match = String(value).match(/^([^\d]*)([\d,]+)(.*)$/);
  const prefix = match ? match[1] : "";
  const target = match ? Number(match[2].replace(/,/g, "")) : null;
  const suffix = match ? match[3] : "";
  const grouped = match ? match[2].includes(",") : false;

  useEffect(() => {
    if (target === null) return;
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      const duration = 1400;
      const start = performance.now();
      const step = now => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(target * eased));
        if (progress < 1) frame = requestAnimationFrame(step);
        else setDisplay(null);
      };
      setDisplay(0);
      frame = requestAnimationFrame(step);
    }, { threshold: 0.4 });

    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [target]);

  if (target === null) return <span ref={ref}>{value}</span>;

  const shown = display === null
    ? value
    : `${prefix}${grouped ? display.toLocaleString("en-US") : display}${suffix}`;

  return (
    <span ref={ref} className="counter">
      <span aria-hidden="true" style={{ fontVariantNumeric: "tabular-nums" }}>{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
