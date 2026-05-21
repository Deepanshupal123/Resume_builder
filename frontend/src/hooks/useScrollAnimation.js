import { useEffect, useRef } from 'react';

export function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe all .scroll-hidden elements
    const elements = document.querySelectorAll('.scroll-hidden');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

// Counter animation hook
export function useCountUp(target, duration = 2000) {
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            start = target;
            clearInterval(timer);
          }
          if (ref.current) ref.current.textContent = Math.floor(start).toLocaleString();
        }, 16);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return ref;
}