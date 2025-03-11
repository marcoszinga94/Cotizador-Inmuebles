import { useState, useEffect } from "react";
import {
  agregarPropiedadAlquiler,
  obtenerPropiedadesAlquiler,
  actualizarPropiedadAlquiler,
  eliminarPropiedadAlquiler,
} from "../lib/propiedadesFirestore";
import type { PropiedadAlquiler } from "../types/propiedadesTypes";
import { onAuthStateChange } from "../lib/firebaseUtils";

export function usePropiedadesAlquiler() {
  const [propiedades, setPropiedades] = useState<PropiedadAlquiler[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChange((isAuth) => {
      setIsAuthenticated(isAuth);
      if (!isAuth) {
        setPropiedades([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Cargar propiedades cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      cargarPropiedades();
    }
  }, [isAuthenticated]);

  // Función para cargar las propiedades
  const cargarPropiedades = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const propiedadesData = await obtenerPropiedadesAlquiler();
      setPropiedades(propiedadesData);
    } catch (err) {
      console.error("Error al cargar propiedades:", err);
      setError(
        err instanceof Error ? err.message : "Error al cargar propiedades"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Función para agregar una propiedad
  const agregarPropiedad = async (propiedad: PropiedadAlquiler) => {
    setIsLoading(true);
    setError(null);

    try {
      await agregarPropiedadAlquiler(propiedad);
      await cargarPropiedades(); // Recargar la lista después de agregar
      return true;
    } catch (err) {
      console.error("Error al agregar propiedad:", err);
      setError(
        err instanceof Error ? err.message : "Error al agregar propiedad"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para actualizar una propiedad
  const actualizarPropiedad = async (
    propiedadId: string,
    propiedad: Partial<PropiedadAlquiler>
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      await actualizarPropiedadAlquiler(propiedadId, propiedad);
      await cargarPropiedades(); // Recargar la lista después de actualizar
      return true;
    } catch (err) {
      console.error("Error al actualizar propiedad:", err);
      setError(
        err instanceof Error ? err.message : "Error al actualizar propiedad"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar una propiedad
  const eliminarPropiedad = async (propiedadId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await eliminarPropiedadAlquiler(propiedadId);
      await cargarPropiedades(); // Recargar la lista después de eliminar
      return true;
    } catch (err) {
      console.error("Error al eliminar propiedad:", err);
      setError(
        err instanceof Error ? err.message : "Error al eliminar propiedad"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    propiedades,
    isLoading,
    error,
    isAuthenticated,
    cargarPropiedades,
    agregarPropiedad,
    actualizarPropiedad,
    eliminarPropiedad,
  };
}
