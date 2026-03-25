import { useState, useEffect, useRef } from "react";

interface AnimatedValueProps {
  value: number;
  duration?: number;
  suffix?: string;
  style?: React.CSSProperties;
}

export default function AnimatedValue({
  value,
  duration = 800,
  suffix = "",
  style,
}: AnimatedValueProps) {
  const [display, setDisplay] = useState(value);
  const startRef = useRef(display);
  const frameRef = useRef(0);

  useEffect(() => {
    const start = startRef.current;
    const diff = value - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + diff * eased;
      setDisplay(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        startRef.current = value;
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value, duration]);

  return <span style={style}>{Math.round(display)}{suffix}</span>;
}
