import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const CountUp = ({ end, duration = 2, suffix = '', prefix = '', decimals = 0, startAnimation = true }) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (!startAnimation || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          let animationFrame;

          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = easeOutQuart * end;
            
            setCount(currentCount);

            if (progress < 1) {
              animationFrame = requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };

          animationFrame = requestAnimationFrame(animate);

          return () => {
            if (animationFrame) {
              cancelAnimationFrame(animationFrame);
            }
          };
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [startAnimation, hasAnimated, end, duration]);

  const displayCount = decimals > 0 ? count.toFixed(decimals) : Math.floor(count).toLocaleString();

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{displayCount}{suffix}
    </span>
  );
};

export default CountUp;
