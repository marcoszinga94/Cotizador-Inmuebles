import React, { useEffect, useState } from "react";
import type { FormData } from "../types/formTypes.ts";
import type { CalculationResults } from "../types/formTypes.ts";
import PdfGenerator from "./PdfGenerator.tsx";

interface ResultadosCotizacionProps {
  formData: FormData;
  resultados: CalculationResults;
}

export const ResultadosCotizacion: React.FC<ResultadosCotizacionProps> = ({
  formData,
  resultados,
}) => {
  const {
    valorActual,
    valorTerreno,
    valorTotal,
    valorTotalDolares,
    coeficienteK,
  } = resultados;

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Activar la animación cuando los resultados cambian
    if (valorTotal > 0) {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  }, [valorTotal]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  };

  return (
    <div
      className={`mt-6 p-6 bg-rosaClaro rounded-lg shadow-sm transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <h3 className="font-bold text-lg mb-4 text-rosaOscuro text-center relative">
        Resultados
        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-rosaOscuro"></span>
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-sm font-medium text-grisOscuro text-start">
          Valor Actual:
        </div>
        <div className="text-sm font-semibold text-grisOscuro text-end">
          {formatCurrency(valorActual)}
        </div>

        <div className="text-sm font-medium text-grisOscuro text-start">
          Valor Terreno:
        </div>
        <div className="text-sm font-semibold text-grisOscuro text-end">
          {formatCurrency(valorTerreno)}
        </div>

        <div className="text-lg font-bold text-rosaOscuro text-start">
          VALOR TOTAL:
        </div>
        <div className="text-lg font-bold text-rosaOscuro text-end">
          {formatCurrency(valorTotal)}
        </div>

        <div className="text-lg font-bold text-verdeDolar text-start">
          En dólares:
        </div>
        <div className="text-lg font-bold text-verdeDolar text-end">
          US$ {valorTotalDolares.toFixed(2)}
        </div>
      </div>

      {valorTotal > 0 && (
        <div className="mt-6 transition-all duration-300 transform hover:scale-105">
          <PdfGenerator
            propiedad={formData.propiedad}
            terreno={formData.terreno}
            valorResidual={formData.valorResidual}
            valorReposicion={formData.valorReposicion}
            anosPropiedad={formData.anosPropiedad}
            estadoPropiedad={formData.estadoPropiedad}
            cantidadM2={formData.cantidadM2}
            valorM2={formData.valorM2}
            dolarHoy={formData.dolarHoy}
            valorActual={valorActual}
            valorTerreno={valorTerreno}
            valorTotal={valorTotal}
            valorTotalDolares={valorTotalDolares}
            coeficienteK={coeficienteK}
          />
        </div>
      )}
    </div>
  );
};
