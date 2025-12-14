import { useState, useEffect } from 'react';

/**
 * Hook to detect page visibility changes.
 *
 * Used to pause 3D animations when the tab is hidden,
 * reducing CPU/GPU usage and improving battery life.
 *
 * @returns true if the page is visible, false if hidden
 */
export function usePageVisibility(): boolean {
  const [isVisible, setIsVisible] = useState(() => !document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return isVisible;
}
