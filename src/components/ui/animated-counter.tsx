"use client";

import { useEffect, useRef, useState } from "react";
import CountUp from "react-countup";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  separator?: string;
  className?: string;
  preserveValue?: boolean;
}

const AnimatedCounter = ({
  from = 0,
  to,
  duration = 2,
  suffix = "",
  prefix = "",
  decimals = 0,
  separator = "",
  className = "",
  preserveValue = false,
}: AnimatedCounterProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const currentRef = counterRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasAnimated]);

  return (
    <span ref={counterRef} className={className}>
      {isVisible ? (
        <CountUp
          start={from}
          end={to}
          duration={duration}
          decimals={decimals}
          separator={separator}
          prefix={prefix}
          suffix={suffix}
          preserveValue={preserveValue}
          useGrouping={true}
        />
      ) : (
        // Placeholder que mantém o layout estável
        <span style={{ opacity: 0 }}>
          {prefix}
          {decimals > 0 ? to.toFixed(decimals) : Math.floor(to)}
          {suffix}
        </span>
      )}
    </span>
  );
};

export default AnimatedCounter;
