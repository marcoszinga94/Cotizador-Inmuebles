"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { usePropiedadAlquilerValidation } from "../hooks/usePropiedadAlquilerValidation";
import { Boton } from "./Boton";
import type { PropiedadAlquiler } from "../types/propiedadesTypes";

const initialFormData: PropiedadAlquiler = {
  propietario: "",
  contactoPropietario: "",
  inquilino: "",
  contactoInquilino: "",
  fechaInicioContrato: new Date().toISOString().split("T")[0],
  duracionContrato: 36,
  precioAlquiler: 100000,
  intervaloAumento: 3,
  direccion: "",
  descripcion: "",
};

interface PropiedadAlquilerFormProps {
  onSubmit: (propiedad: PropiedadAlquiler) => Promise<boolean>;
  propiedadInicial?: PropiedadAlquiler;
  isEditing?: boolean;
}

export default function PropiedadAlquilerForm({
  onSubmit,
  propiedadInicial,
  isEditing = false,
}: PropiedadAlquilerFormProps) {
  const [formData, setFormData] = useState<PropiedadAlquiler>(
    propiedadInicial || initialFormData
  );
  const { errors, isValid } = usePropiedadAlquilerValidation(formData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (propiedadInicial) {
      setFormData(propiedadInicial);
    }
  }, [propiedadInicial]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!isValid) {
      setSubmitError("Por favor, corrija los errores en el formulario");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const success = await onSubmit(formData);

      if (success) {
        setSubmitSuccess(true);
        if (!isEditing) {
          setFormData(initialFormData);
        }
      } else {
        setSubmitError("No se pudo guardar la propiedad");
      }
    } catch (error) {
      console.error("Error al guardar la propiedad:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Error al guardar la propiedad"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-rosaOscuro text-center">
        {isEditing ? "Editar Propiedad" : "Agregar Nueva Propiedad"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-0">
        <div className="p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4 text-rosaOscuro">
            Datos del Propietario
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="propietario"
                className="block text-sm font-medium text-primary mb-1"
              >
                Nombre del Propietario
              </label>
              <input
                type="text"
                id="propietario"
                name="propietario"
                placeholder="Nombre del Propietario"
                value={formData.propietario}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.propietario ? "border-rosaOscuro" : "border-grisClaro"
                }`}
              />
              {errors.propietario && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.propietario}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="contactoPropietario"
                className="block text-sm font-medium text-primary mb-1"
              >
                Contacto del Propietario
              </label>
              <input
                type="text"
                id="contactoPropietario"
                name="contactoPropietario"
                placeholder="Teléfono o Email"
                value={formData.contactoPropietario}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.contactoPropietario
                    ? "border-rosaOscuro"
                    : "border-grisClaro"
                }`}
              />
              {errors.contactoPropietario && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.contactoPropietario}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4 text-rosaOscuro">
            Datos del Inquilino
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="inquilino"
                className="block text-sm font-medium text-primary mb-1"
              >
                Nombre del Inquilino
              </label>
              <input
                type="text"
                id="inquilino"
                name="inquilino"
                placeholder="Nombre del Inquilino"
                value={formData.inquilino}
                onChange={handleInputChange}
                className="w-full p-2 border border-grisClaro rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="contactoInquilino"
                className="block text-sm font-medium text-primary mb-1"
              >
                Contacto del Inquilino
              </label>
              <input
                type="text"
                id="contactoInquilino"
                name="contactoInquilino"
                value={formData.contactoInquilino}
                onChange={handleInputChange}
                placeholder="Teléfono o Email"
                className={`w-full p-2 border rounded-md ${
                  errors.contactoInquilino
                    ? "border-rosaOscuro"
                    : "border-grisClaro"
                }`}
              />
              {errors.contactoInquilino && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.contactoInquilino}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4 text-rosaOscuro">
            Datos del Contrato
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fechaInicioContrato"
                className="block text-sm font-medium text-primary mb-1"
              >
                Fecha de Inicio del Contrato
              </label>
              <input
                type="date"
                id="fechaInicioContrato"
                name="fechaInicioContrato"
                value={formData.fechaInicioContrato}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.fechaInicioContrato
                    ? "border-rosaOscuro"
                    : "border-grisClaro"
                }`}
              />
              {errors.fechaInicioContrato && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.fechaInicioContrato}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="duracionContrato"
                className="block text-sm font-medium text-primary mb-1"
              >
                Duración del Contrato (meses)
              </label>
              <input
                type="number"
                id="duracionContrato"
                name="duracionContrato"
                value={formData.duracionContrato}
                onChange={handleInputChange}
                min="1"
                className={`w-full p-2 border rounded-md ${
                  errors.duracionContrato
                    ? "border-rosaOscuro"
                    : "border-grisClaro"
                }`}
              />
              {errors.duracionContrato && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.duracionContrato}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="precioAlquiler"
                className="block text-sm font-medium text-primary mb-1"
              >
                Precio del Alquiler
              </label>
              <input
                type="number"
                id="precioAlquiler"
                name="precioAlquiler"
                value={formData.precioAlquiler}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full p-2 border rounded-md ${
                  errors.precioAlquiler
                    ? "border-rosaOscuro"
                    : "border-grisClaro"
                }`}
              />
              {errors.precioAlquiler && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.precioAlquiler}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="intervaloAumento"
                className="block text-sm font-medium text-primary mb-1"
              >
                Intervalo de Aumento (meses)
              </label>
              <input
                type="number"
                id="intervaloAumento"
                name="intervaloAumento"
                value={formData.intervaloAumento}
                onChange={handleInputChange}
                min="1"
                className={`w-full p-2 border rounded-md ${
                  errors.intervaloAumento
                    ? "border-rosaOscuro"
                    : "border-grisClaro"
                }`}
              />
              {errors.intervaloAumento && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.intervaloAumento}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-4 text-rosaOscuro">
            Datos de la Propiedad
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label
                htmlFor="direccion"
                className="block text-sm font-medium text-primary mb-1"
              >
                Dirección de la Propiedad
              </label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Dirección de la Propiedad"
                value={formData.direccion}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded-md ${
                  errors.direccion ? "border-rosaOscuro" : "border-grisClaro"
                }`}
              />
              {errors.direccion && (
                <p className="text-rosaOscuro text-xs mt-1">
                  {errors.direccion}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="descripcion"
                className="block text-sm font-medium text-primary mb-1"
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción de la Propiedad"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border border-grisClaro rounded-md"
              />
            </div>
          </div>
        </div>

        {submitError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {submitError}
          </div>
        )}

        {submitSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {isEditing
              ? "Propiedad actualizada correctamente"
              : "Propiedad agregada correctamente"}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <Boton
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting
              ? "Guardando..."
              : isEditing
              ? "Actualizar Propiedad"
              : "Agregar Propiedad"}
          </Boton>
        </div>
      </form>
    </div>
  );
}
