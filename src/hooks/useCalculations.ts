import { useState, useEffect } from "react";
import type { FormData, CalculationResults } from "../types/formTypes";
import { obtenerCoeficienteRossHeidecke } from "../utils/rossHeideckeData";

export const useCalculations = (formData: FormData): CalculationResults => {
  const [valorActual, setValorActual] = useState<number>(0);
  const [valorTerreno, setValorTerreno] = useState<number>(0);
  const [valorTotal, setValorTotal] = useState<number>(0);
  const [valorTotalDolares, setValorTotalDolares] = useState<number>(0);
  const [coeficienteK, setCoeficienteK] = useState<number>(0);

  useEffect(() => {
    calcularValores();
  }, [formData]);

  const calcularValores = () => {
    // Calcular valor del terreno
    const calculoValorTerreno = formData.cantidadM2 * formData.valorM2;
    setValorTerreno(calculoValorTerreno);

    // Obtener coeficiente K de la tabla Ross-Heidecke
    const coeficienteRossHeidecke = obtenerCoeficienteRossHeidecke(
      formData.anosPropiedad,
      formData.estadoPropiedad
    );

    // Guardar el coeficiente K para mostrarlo
    setCoeficienteK(coeficienteRossHeidecke);

    // Calcular valor actual de la construcción usando la fórmula:
    // Valor Reposición - (Valor Reposición - Valor Residual) * Coeficiente K
    const calculoValorActual =
      formData.valorReposicion -
      (formData.valorReposicion - formData.valorResidual) *
        (coeficienteRossHeidecke / 100);

    setValorActual(calculoValorActual);

    // Calcular valor total
    const calculoValorTotal = calculoValorTerreno + calculoValorActual;
    setValorTotal(calculoValorTotal);

    // Convertir a dólares
    setValorTotalDolares(
      formData.dolarHoy > 0 ? calculoValorTotal / formData.dolarHoy : 0
    );
  };

  return {
    valorActual,
    valorTerreno,
    valorTotal,
    valorTotalDolares,
    coeficienteK,
  };
};
