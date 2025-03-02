import { useState, useEffect } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  // Estado para almacenar nuestro valor
  // Pasar la función de inicialización a useState para que solo se ejecute una vez
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Obtener del almacenamiento local por clave
      const item = window.localStorage.getItem(key);
      // Analizar el JSON almacenado o devolver el valor inicial
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Si hay un error, devolver el valor inicial
      console.error(
        `Error al leer del localStorage para la clave "${key}":`,
        error
      );
      return initialValue;
    }
  });

  // Devolver una versión envuelta de la función setter de useState que persiste el nuevo valor en localStorage
  const setValue = (value: T) => {
    try {
      // Permitir que el valor sea una función para que tengamos la misma API que useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Guardar el estado
      setStoredValue(valueToStore);
      // Guardar en localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // Un error más descriptivo
      console.error(
        `Error al escribir en localStorage para la clave "${key}":`,
        error
      );
    }
  };

  // Escuchar cambios en otros contextos (como otras pestañas)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(
            `Error al procesar el cambio de localStorage para la clave "${key}":`,
            error
          );
        }
      }
    };

    // Agregar el event listener
    window.addEventListener("storage", handleStorageChange);

    // Limpiar el event listener
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}
