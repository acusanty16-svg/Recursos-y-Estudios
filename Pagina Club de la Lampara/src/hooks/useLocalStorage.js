import { useState, useCallback } from 'react';

// Regla vercel-react-best-practices: client-localstorage-schema & js-cache-storage
const STORAGE_VERSION = 'v1';

export function useLocalStorage(baseKey, initialValue) {
  const versionedKey = `club_lampara_${STORAGE_VERSION}_${baseKey}`;

  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(versionedKey);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(versionedKey, JSON.stringify(valueToStore));
          }
        } catch {
          // Ignorar errores de cuota de almacenamiento en modo incógnito
        }
        return valueToStore;
      });
    },
    [versionedKey]
  );

  return [storedValue, setValue];
}
