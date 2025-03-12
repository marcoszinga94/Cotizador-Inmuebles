"use client";

import { useState } from "react";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.js";
import { Boton } from "./Boton.tsx";

interface PropiedadAlquilerFormProps {
  propiedadInicial?: PropiedadAlquiler | null;
  onSubmit: (propiedad: PropiedadAlquiler) => Promise<string | boolean>;
  isEditing?: boolean;
  onCancel?: () => void;
}

export default function PropiedadAlquilerForm({
  propiedadInicial,
  onSubmit,
  isEditing = false,
  onCancel,
}: PropiedadAlquilerFormProps) {
  const [formData, setFormData] = useState<PropiedadAlquiler>({
    propietario: propiedadInicial?.propietario || "",
    contactoPropietario: propiedadInicial?.contactoPropietario || "",
    inquilino: propiedadInicial?.inquilino || "",
    contactoInquilino: propiedadInicial?.contactoInquilino || "",
    precioAlquiler: propiedadInicial?.precioAlquiler || 0,
    fechaInicioContrato: propiedadInicial?.fechaInicioContrato || "",
    duracionContrato: propiedadInicial?.duracionContrato || 24,
    intervaloAumento: propiedadInicial?.intervaloAumento || 6,
    descripcion: propiedadInicial?.descripcion || "",
    direccion: propiedadInicial?.direccion || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "precioAlquiler" ||
        name === "duracionContrato" ||
        name === "intervaloAumento"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(formData);
      if (!isEditing) {
        setFormData({
          propietario: "",
          contactoPropietario: "",
          inquilino: "",
          contactoInquilino: "",
          precioAlquiler: 0,
          fechaInicioContrato: "",
          duracionContrato: 24,
          intervaloAumento: 6,
          descripcion: "",
          direccion: "",
        });
      }
    } catch (err) {
      setError("Error al guardar la propiedad");
      console.error("Error al guardar:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-rosaOscuro">
            Datos del Propietario
          </h3>
          <div>
            <label className="block text-sm font-medium text-primary">
              Nombre del Propietario
            </label>
            <input
              type="text"
              name="propietario"
              placeholder="Nombre del Propietario"
              value={formData.propietario}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">
              Contacto del Propietario
            </label>
            <input
              type="text"
              name="contactoPropietario"
              placeholder="Teléfono"
              value={formData.contactoPropietario}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-rosaOscuro">
            Datos del Inquilino
          </h3>
          <div>
            <label className="block text-sm font-medium text-primary">
              Nombre del Inquilino
            </label>
            <input
              type="text"
              name="inquilino"
              placeholder="Nombre del Inquilino"
              value={formData.inquilino}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">
              Contacto del Inquilino
            </label>
            <input
              type="text"
              name="contactoInquilino"
              placeholder="Teléfono"
              value={formData.contactoInquilino}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-rosaOscuro">
            Datos del Contrato
          </h3>
          <div>
            <label className="block text-sm font-medium text-primary">
              Precio del Alquiler
            </label>
            <input
              type="number"
              name="precioAlquiler"
              value={formData.precioAlquiler}
              onChange={handleChange}
              required
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">
              Fecha de Inicio
            </label>
            <input
              type="date"
              name="fechaInicioContrato"
              value={formData.fechaInicioContrato}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">
              Duración del Contrato (meses)
            </label>
            <input
              type="number"
              name="duracionContrato"
              value={formData.duracionContrato}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">
              Intervalo de Aumento (meses)
            </label>
            <input
              type="number"
              name="intervaloAumento"
              value={formData.intervaloAumento}
              onChange={handleChange}
              required
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-rosaOscuro">
            Datos de la Propiedad
          </h3>
          <div>
            <label className="block text-sm font-medium text-primary">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              placeholder="Dirección de la propiedad"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-rosaOscuro focus:ring-rosaOscuro"
              placeholder="Descripción de la propiedad..."
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Boton
            onClick={onCancel}
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800"
          >
            Cancelar
          </Boton>
        )}
        <Boton
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-rosaOscuro text-white"
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
            ? "Guardar Cambios"
            : "Agregar Propiedad"}
        </Boton>
      </div>
    </form>
  );
}
