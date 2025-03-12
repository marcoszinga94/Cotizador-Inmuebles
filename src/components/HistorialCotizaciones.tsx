import React, { useState } from "react";
import type { HistorialItem } from "../types/formTypes.js";
import { Boton } from "./Boton.tsx";

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
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [deleteAnimation, setDeleteAnimation] = useState<string | null>(null);

  const handleEliminar = (id: string) => {
    setDeleteAnimation(id);

    // Esperar a que termine la animación antes de eliminar
    setTimeout(() => {
      onEliminarCotizacion(id);
      setDeleteAnimation(null);
    }, 300);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-6 p-6 bg-rosaClaro rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-rosaOscuro text-center relative">
        Historial de Cotizaciones
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-rosaOscuro"></span>
      </h3>

      <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
        {historial.map((item) => (
          <div
            key={item.id}
            className={`bg-white p-3 rounded-md shadow-sm 
                      transition-all duration-300 card-hover
                      ${
                        deleteAnimation === item.id
                          ? "opacity-0 scale-95 translate-x-5"
                          : "opacity-100"
                      }`}
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h4 className="font-semibold text-rosaOscuro truncate">
                  {item.propiedad}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatDate(item.fecha)}
                </p>
              </div>

              <div className="flex space-x-2">
                <Boton
                  onClick={() => onCargarCotizacion(item)}
                  variant="primary"
                  className="p-1"
                  aria-label="Cargar cotización"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </Boton>
                <Boton
                  onClick={() => handleEliminar(item.id)}
                  variant="danger"
                  className="p-1"
                  aria-label="Eliminar cotización"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </Boton>
                <Boton
                  onClick={() =>
                    setExpandedItem(expandedItem === item.id ? null : item.id)
                  }
                  variant="secondary"
                  className="p-1"
                  aria-label={
                    expandedItem === item.id
                      ? "Colapsar detalles"
                      : "Expandir detalles"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transform transition-transform duration-300 ${
                      expandedItem === item.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Boton>
              </div>
            </div>

            {expandedItem === item.id && (
              <div className="mt-3 text-sm text-gray-600 animate-[fadeIn_0.3s_ease-in-out]">
                <div className="grid grid-cols-2 gap-2">
                  <span>Terreno:</span>
                  <span className="font-medium">{item.terreno}</span>

                  <span>Valor Total:</span>
                  <span className="font-medium">
                    ${item.resultados.valorTotal.toLocaleString()}
                  </span>

                  <span>En dólares:</span>
                  <span className="font-medium">
                    US$ {item.resultados.valorTotalDolares.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
