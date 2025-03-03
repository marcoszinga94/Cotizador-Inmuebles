"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { DatosPropiedad } from "./DatosPropiedad";
import { DatosTerreno } from "./DatosTerreno";
import { ResultadosCotizacion } from "./ResultadosCotizacion";
import { HistorialCotizaciones } from "./HistorialCotizaciones";
import { useFormValidation } from "../hooks/useFormValidation";
import { useDolarApi } from "../hooks/useDolarApi";
import { useCalculations } from "../hooks/useCalculations";
import { useHistorialCotizaciones } from "../hooks/useHistorialCotizaciones";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { FormData } from "../types/formTypes";

//peticion a la api para obtener el valor del dolar blue
const valorDolar = async () => {
  const response = await fetch("https://dolarapi.com/v1/dolares/blue");
  const data = await response.json();
  return data.blue.toFixed(2);
};

export default function CotizadorForm() {
  // Estado inicial del formulario
  const [formData, setFormData] = useLocalStorage<FormData>(
    "cotizador_form_data",
    {
      propiedad: "",
      terreno: "",
      valorResidual: 0,
      valorReposicion: 0,
      anosPropiedad: 0,
      estadoPropiedad: 1,
      cantidadM2: 0,
      valorM2: 0,
      dolarHoy: 0,
    }
  );

  // Hooks personalizados
  const { errors, validateField, validateAllFields } = useFormValidation();
  const {
    valor: dolarValor,
    loading: dolarLoading,
    error: dolarError,
    fetchDolar,
  } = useDolarApi();
  const resultados = useCalculations(formData);
  const { historial, guardarCotizacion, cargarCotizacion, eliminarCotizacion } =
    useHistorialCotizaciones();

  // Actualizar el valor del dólar cuando cambia
  useEffect(() => {
    if (dolarValor > 0 && formData.dolarHoy === 0) {
      setFormData({ ...formData, dolarHoy: dolarValor });
    }
  }, [dolarValor]);

  // Manejar cambios en los inputs
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isNumeric = name !== "propiedad" && name !== "terreno";
    const numericValue = isNumeric ? Number(value) : value;

    // Validar el campo
    const error = validateField(name as keyof FormData, numericValue);

    // Actualizar formData
    setFormData({
      ...formData,
      [name]: numericValue,
    });
  };

  // Manejar el envío del formulario
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validar todos los campos
    if (validateAllFields(formData)) {
      // Guardar la cotización en el historial
      guardarCotizacion(formData, resultados);
    }
  };

  // Cargar el valor del dólar
  const handleCargarDolar = async () => {
    await fetchDolar();
  };

  // Cargar una cotización del historial
  const handleCargarCotizacion = (item: any) => {
    setFormData({
      propiedad: item.propiedad,
      terreno: item.terreno,
      valorResidual: item.valorResidual,
      valorReposicion: item.valorReposicion,
      anosPropiedad: item.anosPropiedad,
      estadoPropiedad: item.estadoPropiedad,
      cantidadM2: item.cantidadM2,
      valorM2: item.valorM2,
      dolarHoy: item.dolarHoy,
    });
  };

  return (
    <div className="relative bg-secondary dark:bg-grisOscuro p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DatosPropiedad
            formData={formData}
            errors={errors}
            coeficienteK={resultados.coeficienteK}
            handleInputChange={handleInputChange}
          />

          <div className="space-y-4">
            <DatosTerreno
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              dolarLoading={dolarLoading}
              onCargarDolar={handleCargarDolar}
            />

            <ResultadosCotizacion formData={formData} resultados={resultados} />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-rosaOscuro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-colors"
          >
            Guardar Cotización
          </button>
        </div>
      </form>

      {historial.length > 0 && (
        <HistorialCotizaciones
          historial={historial}
          onCargarCotizacion={handleCargarCotizacion}
          onEliminarCotizacion={eliminarCotizacion}
        />
      )}
    </div>
  );
}
