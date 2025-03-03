import React from "react";
import type { FormData } from "../types/formTypes";
import type { CalculationResults } from "../types/formTypes";

interface HistorialItem extends FormData, CalculationResults {
  id: string;
  fecha: string;
}

interface HistorialCotizacionesProps {
  historial: HistorialItem[];
  onCargarCotizacion: (item: HistorialItem) => void;
  onEliminarCotizacion: (id: string) => void;
}

export const HistorialCotizaciones: React.FC<HistorialCotizacionesProps> = ({
  historial,
  onCargarCotizacion,
  onEliminarCotizacion,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  };

  if (historial.length === 0) {
    return (
      <div className="mt-8 p-4 bg-grisSuave rounded-lg text-center text-grisOscuro">
        No hay cotizaciones guardadas en el historial.
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-pink-800">
        Historial de Cotizaciones
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-secondary rounded-lg overflow-hidden shadow-md">
          <thead className="bg-rosaOscuro text-secondary">
            <tr>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Propiedad</th>
              <th className="py-3 px-4 text-left">Ubicación</th>
              <th className="py-3 px-4 text-right">Valor Total</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {historial.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-grisSuave transition-colors"
              >
                <td className="py-3 px-4">{item.fecha}</td>
                <td className="py-3 px-4">{item.propiedad}</td>
                <td className="py-3 px-4">{item.terreno}</td>
                <td className="py-3 px-4 text-right font-semibold">
                  {formatCurrency(item.valorTotal)}
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => onCargarCotizacion(item)}
                      className="px-3 py-1 bg-primary text-secondary text-sm rounded hover:bg-rosaOscuro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
                      aria-label={`Cargar cotización de ${item.propiedad}`}
                    >
                      Cargar
                    </button>
                    <button
                      onClick={() => onEliminarCotizacion(item.id)}
                      className="px-3 py-1 bg-rosaOscuro text-secondary text-sm rounded hover:bg-rosaOscuro focus:outline-none focus:ring-2 focus:ring-rosaOscuro focus:ring-opacity-50 transition-colors"
                      aria-label={`Eliminar cotización de ${item.propiedad}`}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
