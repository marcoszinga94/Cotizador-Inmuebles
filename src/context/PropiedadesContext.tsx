import React, { createContext, useContext, useState, useEffect } from "react";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.js";
import {
  agregarPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
  obtenerPropiedades,
} from "../lib/firebaseUtils.js";

interface PropiedadesContextType {
  propiedades: PropiedadAlquiler[];
  isLoading: boolean;
  error: string | null;
  agregarNuevaPropiedad: (propiedad: PropiedadAlquiler) => Promise<string>;
  actualizarPropiedadExistente: (
    propiedadId: string,
    propiedad: Partial<PropiedadAlquiler>
  ) => Promise<boolean>;
  eliminarPropiedadExistente: (propiedadId: string) => Promise<boolean>;
}

const PropiedadesContext = createContext<PropiedadesContextType | undefined>(
  undefined
);

export function PropiedadesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [propiedades, setPropiedades] = useState<PropiedadAlquiler[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPropiedades();
  }, []);

  const cargarPropiedades = async () => {
    try {
      setIsLoading(true);
      const propiedadesData = await obtenerPropiedades();
      setPropiedades(propiedadesData);
      setError(null);
    } catch (err) {
      setError("Error al cargar las propiedades");
      console.error("Error al cargar propiedades:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const agregarNuevaPropiedad = async (
    propiedad: PropiedadAlquiler
  ): Promise<string> => {
    try {
      const id = await agregarPropiedad(propiedad);
      await cargarPropiedades();
      return id;
    } catch (err) {
      setError("Error al agregar la propiedad");
      throw err;
    }
  };

  const actualizarPropiedadExistente = async (
    propiedadId: string,
    propiedad: Partial<PropiedadAlquiler>
  ): Promise<boolean> => {
    try {
      const resultado = await actualizarPropiedad(propiedadId, propiedad);
      if (resultado) {
        await cargarPropiedades();
      }
      return resultado;
    } catch (err) {
      setError("Error al actualizar la propiedad");
      return false;
    }
  };

  const eliminarPropiedadExistente = async (
    propiedadId: string
  ): Promise<boolean> => {
    try {
      const resultado = await eliminarPropiedad(propiedadId);
      if (resultado) {
        await cargarPropiedades();
      }
      return resultado;
    } catch (err) {
      setError("Error al eliminar la propiedad");
      return false;
    }
  };

  const value = {
    propiedades,
    isLoading,
    error,
    agregarNuevaPropiedad,
    actualizarPropiedadExistente,
    eliminarPropiedadExistente,
  };

  return (
    <PropiedadesContext.Provider value={value}>
      {children}
    </PropiedadesContext.Provider>
  );
}

export function usePropiedades() {
  const context = useContext(PropiedadesContext);
  if (context === undefined) {
    throw new Error(
      "usePropiedades debe ser usado dentro de un PropiedadesProvider"
    );
  }
  return context;
}
