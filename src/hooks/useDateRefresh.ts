import { useState, useEffect } from 'react';
import { getLocalDateString } from '../utils/date';

/**
 * Hook that refreshes the app when it becomes visible again after being hidden.
 * This handles cases like returning to the app after it's been in the background overnight.
 */
export function useVisibilityRefresh(): void {
  const [lastDate, setLastDate] = useState(getLocalDateString());

  useEffect(() => {
    // Function to check if date has changed and refresh if needed
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
}
