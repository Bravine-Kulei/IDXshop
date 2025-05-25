import React, { useEffect, useRef, useState } from 'react';

const LazyLoad = ({ children, threshold = 0.1, rootMargin = '0px', placeholder }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the element becomes visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, rootMargin]);

  // Once visible, mark as loaded after a short delay
  useEffect(() => {
    if (isVisible && !hasLoaded) {
      const timer = setTimeout(() => {
        setHasLoaded(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible, hasLoaded]);

  return (
    <div ref={ref} className="w-full h-full">
      {isVisible ? children : placeholder || <div className="w-full h-full bg-gray-800 animate-pulse rounded-lg"></div>}
    </div>
  );
};

export default LazyLoad;
