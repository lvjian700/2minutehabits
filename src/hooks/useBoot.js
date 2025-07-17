import { useState, useEffect } from 'react';
import { getLocalDateString } from '../utils/date';

/**
 * Hook to handle app initialization, service worker updates, and date refresh
 */
export const useBoot = () => {
  const [lastDate, setLastDate] = useState(getLocalDateString());

  // Handle service worker updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, []);

  // Handle visibility refresh when date changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const currentDate = getLocalDateString();
        if (currentDate !== lastDate) {
          setLastDate(currentDate);
          // Force a hard refresh of the page to ensure everything is up to date
          window.location.reload();
        }
      }
    };

    // Add event listener for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lastDate]);
};
