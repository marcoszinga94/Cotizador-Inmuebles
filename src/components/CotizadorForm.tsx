"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import PdfGenerator from "./PdfGenerator";

interface FormData {
  propiedad: string;
  terreno: string;
  valorResidual: number;
  valorReposicion: number;
  anosPropiedad: number;
  estadoPropiedad: number;
  cantidadM2: number;
  valorM2: number;
  dolarHoy: number;
}

export default function CotizadorForm() {
  const [formData, setFormData] = useState<FormData>({
    propiedad: "",
    terreno: "",
    valorResidual: 0,
    valorReposicion: 0,
    anosPropiedad: 0,
    estadoPropiedad: 0,
    cantidadM2: 0,
    valorM2: 0,
    dolarHoy: 0,
  });

  const [valorActual, setValorActual] = useState(0);
  const [valorTerreno, setValorTerreno] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [valorTotalDolares, setValorTotalDolares] = useState(0);
  const [coeficienteK, setCoeficienteK] = useState(0);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

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

  // Tabla completa de Ross-Heidecke
  const obtenerCoeficienteRossHeidecke = (anos: number, estado: number) => {
    // Tabla completa de Ross-Heidecke (100 filas x 9 columnas)
    const tablaRossHeidecke = [
      [0, 0.032, 2.52, 8.09, 18.1, 33.2, 52.6, 75.2, 100],
      [0.505, 0.537, 3.01, 8.55, 18.51, 33.54, 52.84, 75.32, 100],
      [1.02, 1.052, 3.51, 9.03, 18.94, 33.89, 53.09, 75.45, 100],
      [1.545, 1.577, 4.03, 9.51, 19.37, 34.23, 53.34, 75.58, 100],
      [2.08, 2.111, 4.55, 10, 19.8, 34.59, 53.59, 75.71, 100],
      [2.625, 2.656, 5.08, 10.5, 20.25, 34.95, 53.84, 75.85, 100],
      [3.18, 3.211, 5.62, 11.01, 20.7, 35.32, 54.11, 75.99, 100],
      [3.745, 3.776, 6.17, 11.53, 21.17, 35.7, 54.38, 76.13, 100],
      [4.32, 4.351, 6.73, 12.06, 21.64, 36.09, 54.65, 76.27, 100],
      [4.905, 4.935, 7.3, 12.6, 22.12, 36.48, 54.93, 76.41, 100],
      [5.5, 5.53, 7.88, 13.15, 22.6, 36.87, 55.21, 76.56, 100],
      [6.105, 6.135, 8.47, 13.7, 23.1, 37.27, 55.49, 76.71, 100],
      [6.72, 6.75, 9.07, 14.27, 23.61, 37.68, 55.78, 76.86, 100],
      [7.345, 7.375, 9.68, 14.84, 24.12, 38.1, 56.08, 77.02, 100],
      [7.98, 8.009, 10.3, 15.42, 24.63, 38.52, 56.38, 77.18, 100],
      [8.625, 8.654, 10.93, 16.02, 25.16, 38.95, 56.69, 77.34, 100],
      [9.28, 9.309, 11.57, 16.62, 25.7, 39.39, 57, 77.5, 100],
      [9.945, 9.974, 12.22, 17.23, 26.25, 39.84, 57.31, 77.66, 100],
      [10.62, 10.649, 12.87, 17.85, 26.8, 40.29, 57.63, 77.83, 100],
      [11.305, 11.333, 13.54, 18.48, 27.36, 40.75, 57.96, 78, 100],
      [12, 12.028, 14.22, 19.12, 27.93, 41.22, 58.29, 78.17, 100],
      [12.705, 12.733, 14.51, 19.77, 28.51, 41.69, 58.62, 78.35, 100],
      [13.42, 13.448, 15.6, 20.42, 29.09, 42.16, 58.96, 78.53, 100],
      [14.145, 14.173, 16.31, 21.09, 29.68, 42.65, 59.3, 78.71, 100],
      [14.83, 14.907, 17.03, 21.77, 30.28, 43.14, 59.65, 78.89, 100],
      [15.625, 15.652, 17.75, 22.45, 30.89, 43.64, 60, 79.07, 100],
      [16.38, 16.407, 18.49, 23.14, 31.51, 44.14, 60.36, 79.26, 100],
      [17.145, 17.171, 19.23, 23.85, 32.14, 44.65, 60.72, 79.45, 100],
      [17.92, 17.956, 19.99, 24.56, 32.78, 45.17, 61.09, 79.64, 100],
      [18.705, 18.731, 20.75, 25.28, 33.42, 45.69, 61.46, 79.84, 100],
      [19.5, 19.526, 21.53, 26.01, 34.07, 46.22, 61.84, 80.04, 100],
      [20.305, 20.33, 22.31, 26.75, 34.73, 46.76, 62.22, 80.24, 100],
      [21.12, 21.155, 23.11, 27.5, 35.4, 47.31, 62.61, 80.44, 100],
      [21.945, 21.97, 23.9, 28.26, 36.07, 47.86, 63, 80.64, 100],
      [22.78, 22.805, 24.73, 29.03, 36.76, 48.42, 63.4, 80.85, 100],
      [23.625, 23.649, 25.55, 29.8, 37.45, 48.98, 63.8, 81.06, 100],
      [24.48, 24.504, 26.38, 30.59, 38.15, 49.55, 64.2, 81.27, 100],
      [25.345, 25.349, 27.23, 31.38, 38.86, 50.13, 64.61, 81.48, 100],
      [26.22, 26.244, 28.08, 32.19, 39.57, 50.71, 65.03, 81.7, 100],
      [27.105, 27.128, 28.94, 33, 40.3, 51.3, 65.45, 81.92, 100],
      [28, 28.023, 29.81, 33.82, 41.03, 51.9, 65.87, 82.14, 100],
      [28.905, 28.928, 30.7, 34.66, 41.77, 52.51, 66.3, 82.37, 100],
      [29.82, 29.842, 31.59, 35.5, 42.52, 53.12, 66.73, 82.6, 100],
      [30.745, 30.767, 32.49, 36.35, 43.28, 53.74, 67.17, 82.83, 100],
      [31.68, 31.702, 33.4, 37.21, 44.05, 54.36, 67.61, 83.06, 100],
      [32.625, 32.646, 34.32, 38.08, 44.82, 54.99, 68.06, 83.29, 100],
      [33.58, 33.601, 35.25, 38.95, 45.6, 55.63, 68.51, 83.53, 100],
      [34.545, 34.566, 36.19, 39.84, 46.39, 56.28, 68.97, 83.77, 100],
      [35.52, 35.541, 37.14, 40.74, 47.19, 56.93, 69.43, 84.01, 100],
      [36.505, 36.525, 38.1, 41.64, 48, 57.59, 69.9, 84.25, 100],
      [37.5, 37.52, 39.07, 42.56, 48.81, 58.25, 70.37, 84.5, 100],
      [38.505, 38.525, 40.05, 43.48, 49.63, 58.92, 70.85, 84.75, 100],
      [39.52, 39.539, 41.04, 44.41, 50.46, 59.6, 71.33, 85, 100],
      [40.545, 40.564, 42.04, 45.35, 51.3, 60.28, 71.82, 85.25, 100],
      [41.58, 41.599, 43.05, 46.3, 52.15, 60.97, 72.31, 85.51, 100],
      [42.625, 42.643, 44.07, 47.26, 53.01, 61.67, 72.8, 85.77, 100],
      [43.68, 43.698, 45.1, 48.24, 53.87, 62.38, 73.3, 86.03, 100],
      [44.745, 44.763, 46.14, 49.22, 54.74, 63.09, 73.81, 86.29, 100],
      [45.82, 45.837, 47.19, 50.2, 55.62, 63.81, 74.32, 86.56, 100],
      [46.905, 46.922, 48.25, 51.2, 55.61, 64.53, 74.83, 86.83, 100],
      [48, 48.017, 49.32, 52.2, 57.41, 65.26, 75.35, 87.1, 100],
      [49.105, 49.121, 50.39, 53.22, 58.32, 66, 75.87, 87.38, 100],
      [50.22, 50.236, 51.47, 54.25, 59.23, 66.75, 76.4, 87.66, 100],
      [51.345, 51.361, 52.57, 55.28, 60.15, 67.5, 76.94, 87.94, 100],
      [52.48, 52.495, 53.68, 56.32, 61.08, 68.26, 77.48, 88.22, 100],
      [53.625, 53.64, 54.8, 57.38, 62.02, 69.02, 78.02, 88.5, 100],
      [54.78, 54.794, 55.93, 58.44, 62.96, 69.79, 78.57, 88.79, 100],
      [55.945, 55.959, 57.06, 59.51, 63.92, 70.57, 79.12, 89.08, 100],
      [57.12, 57.134, 58.2, 60.59, 64.88, 71.36, 79.68, 89.37, 100],
      [58.305, 58.318, 59.36, 61.68, 65.85, 72.15, 80.24, 89.66, 100],
      [59.5, 59.513, 60.52, 62.78, 66.83, 72.95, 80.8, 89.96, 100],
      [60.705, 60.718, 61.7, 63.88, 67.82, 73.75, 81.37, 90.26, 100],
      [61.92, 61.932, 62.88, 65, 68.81, 74.56, 81.93, 90.56, 100],
      [63.145, 63.157, 64.08, 66.13, 69.81, 75.38, 82.53, 90.86, 100],
      [64.38, 64.391, 65.28, 67.26, 70.83, 76.21, 83.12, 91.17, 100],
      [65.625, 65.636, 66.49, 68.4, 71.85, 77.04, 83.71, 91.47, 100],
      [66.88, 66.891, 67.71, 69.56, 72.87, 77.88, 84.3, 91.78, 100],
      [68.145, 68.155, 68.95, 70.72, 73.91, 78.72, 84.9, 92.1, 100],
      [69.42, 69.43, 70.19, 71.89, 74.95, 79.57, 85.5, 92.42, 100],
      [70.705, 70.714, 71.44, 73.07, 76.01, 80.43, 86.11, 92.74, 100],
      [72, 72.009, 72.71, 74.27, 77.07, 81.3, 86.73, 93.06, 100],
      [73.305, 73.314, 73.98, 75.47, 78.14, 82.17, 87.35, 93.38, 100],
      [74.62, 74.628, 75.26, 76.67, 79.21, 83.05, 87.97, 93.7, 100],
      [75.945, 75.953, 76.56, 77.89, 80.3, 83.93, 88.6, 94.03, 100],
      [77.28, 77.287, 77.85, 79.12, 81.39, 84.82, 89.23, 94.36, 100],
      [78.625, 78.632, 79.16, 80.35, 82.49, 85.72, 89.87, 94.7, 100],
      [79.98, 79.986, 80.48, 81.6, 83.6, 86.63, 90.51, 95.05, 100],
      [81.345, 81.351, 81.82, 82.85, 84.72, 87.54, 91.16, 95.35, 100],
      [82.72, 82.725, 83.16, 84.12, 85.85, 88.46, 91.81, 95.72, 100],
      [84.105, 84.11, 84.51, 85.39, 86.98, 89.38, 92.47, 96.06, 100],
      [85.5, 85.505, 85.87, 86.67, 88.12, 90.31, 93.13, 96.4, 100],
      [86.905, 86.909, 87.23, 87.96, 89.27, 91.25, 93.79, 96.75, 100],
      [88.32, 88.324, 88.61, 89.26, 90.43, 92.2, 94.46, 97.1, 100],
      [89.745, 89.748, 90, 90.57, 91.59, 93.15, 95.14, 97.45, 100],
      [91.18, 91.183, 91.4, 91.89, 92.77, 94.11, 95.82, 97.81, 100],
      [92.625, 92.627, 92.81, 93.22, 93.96, 95.07, 96.5, 98.17, 100],
      [94.08, 94.082, 94.56, 94.56, 95.15, 96.04, 97.19, 98.53, 100],
      [95.545, 95.546, 95.66, 95.91, 96.45, 97.02, 97.89, 98.89, 100],
      [97.02, 97.021, 97.1, 97.26, 97.56, 98.01, 98.59, 99.26, 100],
      [98.505, 98.505, 98.54, 98.63, 98.78, 99, 99.29, 99.63, 100],
    ];

    // Asegurarse de que los años estén dentro del rango (0-99)
    const anoIndex = Math.min(Math.max(Math.floor(anos), 0), 99);

    // El estado va de 1 a 9, ajustamos para el índice de columna (0-8)
    const estadoIndex = Math.min(Math.max(estado - 1, 0), 8);

    // Devolver el valor directamente (ya está en porcentaje)
    return tablaRossHeidecke[anoIndex][estadoIndex];
  };

  const validateField = (
    name: keyof FormData,
    value: string | number
  ): string => {
    if (name === "propiedad" || name === "terreno") {
      if (typeof value === "string" && value.trim() === "") {
        return `El campo ${name} es requerido`;
      }
    } else if (typeof value === "number") {
      if (name === "dolarHoy" && value <= 0) {
        return "El valor del dólar debe ser mayor a 0";
      }
      if (
        (name === "valorResidual" ||
          name === "valorReposicion" ||
          name === "cantidadM2" ||
          name === "valorM2") &&
        value < 0
      ) {
        return `El ${name} no puede ser negativo`;
      }
    }
    return "";
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isNumeric = name !== "propiedad" && name !== "terreno";
    const numericValue = isNumeric ? Number(value) : value;

    // Validar el campo
    const error = validateField(name as keyof FormData, numericValue);

    // Actualizar errores
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Actualizar formData
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let hasErrors = false;

    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key as keyof FormData, value);
      if (error) {
        newErrors[key as keyof FormData] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      calcularValores();
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(value);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-blue-800 text-center">
            Datos de la Propiedad
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Propietario
            </label>
            <input
              type="text"
              name="propiedad"
              value={formData.propiedad}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.propiedad ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nombre y Apellido"
            />
            {errors.propiedad && (
              <p className="text-red-500 text-xs mt-1">{errors.propiedad}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Ubicacion
            </label>
            <input
              type="text"
              name="terreno"
              value={formData.terreno}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.terreno ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Calle y Altura"
            />
            {errors.terreno && (
              <p className="text-red-500 text-xs mt-1">{errors.terreno}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Valor Residual ($)
              </label>
              <input
                type="number"
                name="valorResidual"
                value={formData.valorResidual}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.valorResidual ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Valor Residual"
              />
              {errors.valorResidual && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.valorResidual}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Valor que tiene un activo al final de su vida útil
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Valor Reposición ($)
              </label>
              <input
                type="number"
                name="valorReposicion"
                value={formData.valorReposicion}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.valorReposicion ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.valorReposicion && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.valorReposicion}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Costo de reemplazar un activo con otro de características
                similares
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Años de Propiedad
              </label>
              <input
                type="number"
                name="anosPropiedad"
                value={formData.anosPropiedad}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Estado de Propiedad
              </label>
              <select
                name="estadoPropiedad"
                value={formData.estadoPropiedad}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              >
                <option value="1">1 - Excelente</option>
                <option value="2">2 - Muy Bueno</option>
                <option value="3">3 - Bueno</option>
                <option value="4">4 - Regular</option>
                <option value="5">5 - Reparaciones Sencillas</option>
                <option value="6">6 - Reparaciones Importantes</option>
                <option value="7">7 - Muy Malo</option>
                <option value="8">8 - Demolición</option>
                <option value="9">9 - Sin Valor</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Coeficiente K (%)
            </label>
            <input
              type="text"
              name="coeficienteK"
              value={coeficienteK.toFixed(3) + "%"}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Valor obtenido de la tabla Ross-Heidecke según la edad y estado de
              la propiedad
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4 text-blue-800 text-center">
            Datos del Terreno
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Cantidad m²
              </label>
              <input
                type="number"
                name="cantidadM2"
                value={formData.cantidadM2}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.cantidadM2 ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cantidadM2 && (
                <p className="text-red-500 text-xs mt-1">{errors.cantidadM2}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Valor m² ($)
              </label>
              <input
                type="number"
                name="valorM2"
                value={formData.valorM2}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  errors.valorM2 ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.valorM2 && (
                <p className="text-red-500 text-xs mt-1">{errors.valorM2}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Dólar Hoy ($)
            </label>
            <input
              type="number"
              name="dolarHoy"
              value={formData.dolarHoy}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                errors.dolarHoy ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.dolarHoy && (
              <p className="text-red-500 text-xs mt-1">{errors.dolarHoy}</p>
            )}
          </div>

          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm">
            <h3 className="font-bold text-lg mb-4 text-blue-800">Resultados</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-sm font-medium text-gray-700">
                Coeficiente K utilizado:
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {coeficienteK.toFixed(3)}%
              </div>

              <div className="text-sm font-medium text-gray-700">
                Valor Actual:
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(valorActual)}
              </div>

              <div className="text-sm font-medium text-gray-700">
                Valor Terreno:
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatCurrency(valorTerreno)}
              </div>

              <div className="text-sm font-bold mt-2 text-blue-800">
                VALOR TOTAL:
              </div>
              <div className="text-lg font-bold mt-2 text-blue-800">
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
        </div>
      </div>
    </form>
  );
}
