import React from "react";
import type { FormData } from "../types/formTypes";
import type { CalculationResults } from "../types/formTypes";
import PdfGenerator from "./PdfGenerator";

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg shadow-sm">
      <h3 className="font-bold text-lg mb-4 text-pink-800">Resultados</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="text-sm font-medium text-gray-700">Valor Actual:</div>
        <div className="text-sm font-semibold text-gray-900">
          {formatCurrency(valorActual)}
        </div>

        <div className="text-sm font-medium text-gray-700">Valor Terreno:</div>
        <div className="text-sm font-semibold text-gray-900">
          {formatCurrency(valorTerreno)}
        </div>

        <div className="text-sm font-bold mt-2 text-pink-800">VALOR TOTAL:</div>
        <div className="text-lg font-bold mt-2 text-pink-800">
          {formatCurrency(valorTotal)}
        </div>

        <div className="text-sm font-medium text-gray-700">Dólares:</div>
        <div className="text-sm font-semibold text-gray-900">
          US$ {valorTotalDolares.toFixed(2)}
        </div>
      </div>

      {valorTotal > 0 && (
        <div className="mt-6">
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
