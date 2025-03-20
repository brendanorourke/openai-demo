
import { useEffect, useState, useRef } from 'react';

export const useIntersectionObserver = (
  options = { threshold: 0.1, triggerOnce: true }
) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (!options.triggerOnce) {
        setIsVisible(false);
      }
    }, options);

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.threshold, options.triggerOnce]);

  return { ref, isVisible };
};

export const useImageLoad = () => {
  const [loaded, setLoaded] = useState(false);
  
  const handleImageLoaded = () => {
    setLoaded(true);
  };
  
  return { loaded, handleImageLoaded };
};

export const getAnimationClasses = (isVisible: boolean, delay: number = 0) => {
  if (!isVisible) return 'opacity-0';
  
  return `animate-fade-in [animation-delay:${delay}ms] [animation-fill-mode:forwards]`;
};

export const staggeredAnimation = (index: number, baseDelay: number = 100) => {
  return {
    animationDelay: `${index * baseDelay}ms`,
    animationFillMode: 'forwards' as const,
  };
};
