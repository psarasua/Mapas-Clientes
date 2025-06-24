// hooks/useSafeState.js
// Custom hook para manejar estado seguro en componentes funcionales de React.
// Evita actualizaciones de estado en componentes desmontados, previniendo errores y fugas de memoria.
// Devuelve el estado y un setter seguro.

import { useRef, useState, useEffect, useCallback } from 'react';

export function useSafeState(initialValue) {
  const [state, setState] = useState(initialValue);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const setSafeState = useCallback((value) => {
    if (mounted.current) setState(value);
  }, []);

  return [state, setSafeState];
}
