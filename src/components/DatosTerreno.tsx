import React from "react";
import type { ChangeEvent } from "react";
import type { FormData } from "../types/formTypes.ts";
import { Boton } from "./Boton.tsx";

interface DatosTerrenoProps {
  formData: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  dolarLoading: boolean;
  onCargarDolar: () => void;
  dolarError?: string | null;
}

export const DatosTerreno: React.FC<DatosTerrenoProps> = ({
  formData,
  errors,
  handleInputChange,
  dolarLoading,
  onCargarDolar,
  dolarError,
}) => {
  return (
    <div className="gap-4">
      <h2 className="text-xl font-bold text-rosaOscuro text-center">
        Datos del Terreno
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-primary">
            Cantidad de m²
          </label>
          <input
            type="number"
            name="cantidadM2"
            value={formData.cantidadM2}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
              errors.cantidadM2 ? "border-rosaOscuro" : "border-grisClaro"
            }`}
            placeholder="Metros cuadrados"
            aria-label="Cantidad de metros cuadrados"
            aria-invalid={!!errors.cantidadM2}
            aria-describedby={
              errors.cantidadM2 ? "cantidadM2-error" : undefined
            }
          />
          {errors.cantidadM2 && (
            <p id="cantidadM2-error" className="text-rosaOscuro text-xs mt-1">
              {errors.cantidadM2}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-primary">
            Valor del m² en ARS
          </label>
          <input
            type="number"
            name="valorM2"
            value={formData.valorM2}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
              errors.valorM2 ? "border-rosaOscuro" : "border-grisClaro"
            }`}
            placeholder="Valor por metro cuadrado"
            aria-label="Valor por metro cuadrado"
            aria-invalid={!!errors.valorM2}
            aria-describedby={errors.valorM2 ? "valorM2-error" : undefined}
          />
          {errors.valorM2 && (
            <p id="valorM2-error" className="text-rosaOscuro text-xs mt-1">
              {errors.valorM2}
            </p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <label className="block text-sm font-medium mb-1 text-primary">
              Dólar Hoy ($)
            </label>
            <input
              type="number"
              name="dolarHoy"
              value={formData.dolarHoy}
              onChange={handleInputChange}
              readOnly
              className={`w-full p-2 border border-grisClaro rounded bg-grisClaro cursor-not-allowed ${
                errors.dolarHoy ? "border-rosaOscuro" : "border-grisClaro"
              }`}
              placeholder="Valor del dólar"
              aria-label="Valor del dólar hoy"
              aria-invalid={!!errors.dolarHoy}
              aria-describedby={errors.dolarHoy ? "dolarHoy-error" : undefined}
            />
          </div>
          <Boton
            type="button"
            onClick={onCargarDolar}
            isLoading={dolarLoading}
            disabled={dolarLoading}
            variant="primary"
            aria-label="Cargar valor del dólar automáticamente"
          >
            Cargar Dólar
          </Boton>
        </div>
        {errors.dolarHoy && (
          <p id="dolarHoy-error" className="text-rosaOscuro text-xs mt-1">
            {errors.dolarHoy}
          </p>
        )}
      </div>
    </div>
  );
};
