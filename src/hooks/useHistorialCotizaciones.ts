import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { FormData } from "../types/formTypes";
import type { CalculationResults } from "../types/formTypes";

interface HistorialItem extends FormData, CalculationResults {
  id: string;
  fecha: string;
}

interface HistorialHookResult {
  historial: HistorialItem[];
  guardarCotizacion: (
    formData: FormData,
    resultados: CalculationResults
  ) => string;
  cargarCotizacion: (id: string) => HistorialItem | null;
  eliminarCotizacion: (id: string) => void;
}

export const useHistorialCotizaciones = (): HistorialHookResult => {
  const [historial, setHistorial] = useLocalStorage<HistorialItem[]>(
    "cotizador_historial",
    []
  );

  const guardarCotizacion = (
    formData: FormData,
    resultados: CalculationResults
  ): string => {
    const nuevaCotizacion: HistorialItem = {
      ...formData,
      ...resultados,
      id: Date.now().toString(),
      fecha: new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const nuevoHistorial = [nuevaCotizacion, ...historial];
    setHistorial(nuevoHistorial);

    return nuevaCotizacion.id;
  };

  const cargarCotizacion = (id: string): HistorialItem | null => {
    const cotizacion = historial.find((item) => item.id === id);
    return cotizacion || null;
  };

  const eliminarCotizacion = (id: string): void => {
    const nuevoHistorial = historial.filter((item) => item.id !== id);
    setHistorial(nuevoHistorial);
  };

  return {
    historial,
    guardarCotizacion,
    cargarCotizacion,
    eliminarCotizacion,
  };
};
