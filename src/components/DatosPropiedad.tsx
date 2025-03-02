import React from "react";
import type { ChangeEvent } from "react";
import type { FormData } from "../types/formTypes";
import { estadosPropiedad } from "../utils/rossHeideckeData";

interface DatosPropiedadProps {
  formData: FormData;
  errors: Partial<Record<keyof FormData, string>>;
  coeficienteK: number;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const DatosPropiedad: React.FC<DatosPropiedadProps> = ({
  formData,
  errors,
  coeficienteK,
  handleInputChange,
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4 text-pink-800 text-center">
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
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
            errors.propiedad ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Nombre y Apellido"
          aria-label="Nombre del propietario"
          aria-invalid={!!errors.propiedad}
          aria-describedby={errors.propiedad ? "propiedad-error" : undefined}
        />
        {errors.propiedad && (
          <p id="propiedad-error" className="text-red-500 text-xs mt-1">
            {errors.propiedad}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 text-gray-700">
          Ubicación
        </label>
        <input
          type="text"
          name="terreno"
          value={formData.terreno}
          onChange={handleInputChange}
          className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
            errors.terreno ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Calle y Altura"
          aria-label="Ubicación del terreno"
          aria-invalid={!!errors.terreno}
          aria-describedby={errors.terreno ? "terreno-error" : undefined}
        />
        {errors.terreno && (
          <p id="terreno-error" className="text-red-500 text-xs mt-1">
            {errors.terreno}
          </p>
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
              errors.valorResidual ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Valor Residual"
            aria-label="Valor residual de la propiedad"
            aria-invalid={!!errors.valorResidual}
            aria-describedby={
              errors.valorResidual
                ? "valorResidual-error"
                : "valorResidual-desc"
            }
          />
          {errors.valorResidual ? (
            <p id="valorResidual-error" className="text-red-500 text-xs mt-1">
              {errors.valorResidual}
            </p>
          ) : (
            <p id="valorResidual-desc" className="text-xs text-gray-500 mt-1">
              Valor que tiene un activo al final de su vida útil
            </p>
          )}
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
              errors.valorReposicion ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Valor de Reposición"
            aria-label="Valor de reposición de la propiedad"
            aria-invalid={!!errors.valorReposicion}
            aria-describedby={
              errors.valorReposicion
                ? "valorReposicion-error"
                : "valorReposicion-desc"
            }
          />
          {errors.valorReposicion ? (
            <p id="valorReposicion-error" className="text-red-500 text-xs mt-1">
              {errors.valorReposicion}
            </p>
          ) : (
            <p id="valorReposicion-desc" className="text-xs text-gray-500 mt-1">
              Costo de reemplazar un activo con otro de características
              similares
            </p>
          )}
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
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
              errors.anosPropiedad ? "border-red-500" : "border-gray-300"
            }`}
            min="0"
            max="99"
            aria-label="Años de la propiedad"
            aria-invalid={!!errors.anosPropiedad}
            aria-describedby={
              errors.anosPropiedad ? "anosPropiedad-error" : undefined
            }
          />
          {errors.anosPropiedad && (
            <p id="anosPropiedad-error" className="text-red-500 text-xs mt-1">
              {errors.anosPropiedad}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Estado de Propiedad
          </label>
          <select
            name="estadoPropiedad"
            value={formData.estadoPropiedad}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all ${
              errors.estadoPropiedad ? "border-red-500" : "border-gray-300"
            }`}
            aria-label="Estado de la propiedad"
            aria-invalid={!!errors.estadoPropiedad}
            aria-describedby={
              errors.estadoPropiedad ? "estadoPropiedad-error" : undefined
            }
          >
            <option value="">Seleccione un estado</option>
            {estadosPropiedad.map((estado) => (
              <option key={estado.id} value={estado.id}>
                {estado.id} - {estado.nombre}
              </option>
            ))}
          </select>
          {errors.estadoPropiedad && (
            <p id="estadoPropiedad-error" className="text-red-500 text-xs mt-1">
              {errors.estadoPropiedad}
            </p>
          )}
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
          aria-label="Coeficiente K"
        />
        <p className="text-xs text-gray-500 mt-1">
          Valor obtenido de la tabla Ross-Heidecke según la edad y estado de la
          propiedad
        </p>
      </div>
    </div>
  );
};
