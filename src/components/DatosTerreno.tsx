import React from "react";
import type { ChangeEvent } from "react";
import type { FormData } from "../types/formTypes";

interface DatosTerrenoProps {
  formData: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  dolarLoading: boolean;
  onCargarDolar: () => void;
}

export const DatosTerreno: React.FC<DatosTerrenoProps> = ({
  formData,
  errors,
  handleInputChange,
  dolarLoading,
  onCargarDolar,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-rosaOscuro text-center">
        Datos del Terreno
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-grisOscuro">
            Cantidad m²
          </label>
          <input
            type="number"
            name="cantidadM2"
            value={formData.cantidadM2}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
              errors.cantidadM2 ? "border-rosaOscuro" : "border-grisSuave"
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
          <label className="block text-sm font-medium mb-1 text-grisOscuro">
            Valor m² ($)
          </label>
          <input
            type="number"
            name="valorM2"
            value={formData.valorM2}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary transition-all ${
              errors.valorM2 ? "border-rosaOscuro" : "border-grisSuave"
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
            <label className="block text-sm font-medium mb-1 text-grisOscuro">
              Dólar Hoy ($)
            </label>
            <input
              type="number"
              name="dolarHoy"
              value={formData.dolarHoy}
              onChange={handleInputChange}
              readOnly
              className={`w-full p-2 border border-grisSuave rounded bg-grisSuave cursor-not-allowed ${
                errors.dolarHoy ? "border-rosaOscuro" : "border-grisSuave"
              }`}
              placeholder="Valor del dólar"
              aria-label="Valor del dólar hoy"
              aria-invalid={!!errors.dolarHoy}
              aria-describedby={errors.dolarHoy ? "dolarHoy-error" : undefined}
            />
          </div>
          <button
            type="button"
            onClick={onCargarDolar}
            disabled={dolarLoading}
            className="px-4 py-2 bg-primary text-secondary rounded hover:bg-rosaOscuro focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 transition-alls disabled:bg-pink-300"
            aria-label="Cargar valor del dólar automáticamente"
          >
            {dolarLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-secondary"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Cargando...
              </span>
            ) : (
              "Cargar Dólar"
            )}
          </button>
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
