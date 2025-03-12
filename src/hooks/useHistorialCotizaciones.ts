import { useState, useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage.js";
import type {
  FormData,
  CalculationResults,
  HistorialItem,
} from "../types/formTypes.js";

interface HistorialHookResult {
  historial: HistorialItem[];
  guardarCotizacion: (
    formData: FormData,
    resultados: CalculationResults
  ) => string;
  cargarCotizacion: (item: HistorialItem) => void;
  eliminarCotizacion: (id: string) => void;
}

export const useHistorialCotizaciones = (): HistorialHookResult => {
  const [historial, setHistorial] = useLocalStorage<HistorialItem[]>(
    "tasador_historial",
    []
  );

  const guardarCotizacion = (
    formData: FormData,
    resultados: CalculationResults
  ): string => {
    const nuevaCotizacion: HistorialItem = {
      ...formData,
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      resultados,
    };

    const nuevoHistorial = [nuevaCotizacion, ...historial];
    setHistorial(nuevoHistorial);

    return nuevaCotizacion.id;
  };

  const cargarCotizacion = (item: HistorialItem): void => {
    // Esta función ahora recibe directamente el item completo
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
