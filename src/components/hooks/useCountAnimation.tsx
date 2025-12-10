import { useEffect, useState } from "react";

const useCountAnimation = (endValue: number, duration: number = 1000) => {
    const [count, setCount] = useState(endValue);
    const [mounted, setMounted] = useState(false);
  
    useEffect(() => {
      setMounted(true);
    }, []);
  
    useEffect(() => {
      if (!mounted) return;
      
      // Return early if window is not available (SSR)
      if (typeof window === 'undefined') {
        setCount(endValue);
        return;
      }
      
      let startTime: number;
      let animationFrame: number;
  
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = (currentTime - startTime) / duration;
  
        if (progress < 1) {
          setCount(Math.floor(endValue * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(endValue);
        }
      };
  
      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [endValue, duration, mounted]);
  
    return count;
  };
  
  export default useCountAnimation;