import { useEffect, useRef, useState } from 'react';

export default function CountUpNumber({ value = 6 }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [count, setCount] = useState(0);
  const targetRef = useRef(null);
  const hasCounted = useRef(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setReducedMotion(query.matches);
      if (query.matches) {
        setCount(value);
        hasCounted.current = true;
      }
    };
    update();
    query.addEventListener?.('change', update);
    return () => query.removeEventListener?.('change', update);
  }, [value]);

  useEffect(() => {
    if (reducedMotion || hasCounted.current) return undefined;
    const element = targetRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') {
      setCount(value);
      hasCounted.current = true;
      return undefined;
    }

    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || hasCounted.current) return;
      hasCounted.current = true;
      observer.unobserve(element);
      const start = performance.now();
      const duration = 1100;
      const animate = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        setCount(Math.round(value * (1 - (1 - progress) ** 3)));
        if (progress < 1) frame = requestAnimationFrame(animate);
      };
      frame = requestAnimationFrame(animate);
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reducedMotion, value]);

  return <span ref={targetRef} aria-label={`${value} años`}>{count}</span>;
}
