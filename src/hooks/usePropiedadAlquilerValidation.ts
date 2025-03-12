import { useState, useEffect } from "react";
import type {
  PropiedadAlquiler,
  PropiedadAlquilerErrors,
} from "../types/propiedadesTypes.js";

export function usePropiedadAlquilerValidation(formData: PropiedadAlquiler) {
  const [errors, setErrors] = useState<PropiedadAlquilerErrors>({});
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const newErrors: PropiedadAlquilerErrors = {};

    // Validar propietario
    if (!formData.propietario.trim()) {
      newErrors.propietario = "El nombre del propietario es obligatorio";
    }

    // Validar contacto del propietario
    if (!formData.contactoPropietario.trim()) {
      newErrors.contactoPropietario =
        "El contacto del propietario es obligatorio";
    } else if (
      !/^[0-9\s\-\+\(\)]+$/.test(formData.contactoPropietario.trim()) &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.contactoPropietario.trim()
      )
    ) {
      newErrors.contactoPropietario =
        "Ingrese un número de teléfono o email válido";
    }

    // Validar inquilino (opcional si no hay inquilino aún)
    if (formData.inquilino.trim() && !formData.contactoInquilino.trim()) {
      newErrors.contactoInquilino =
        "Si hay inquilino, el contacto es obligatorio";
    } else if (
      formData.contactoInquilino.trim() &&
      !/^[0-9\s\-\+\(\)]+$/.test(formData.contactoInquilino.trim()) &&
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        formData.contactoInquilino.trim()
      )
    ) {
      newErrors.contactoInquilino =
        "Ingrese un número de teléfono o email válido";
    }

    // Validar fecha de inicio del contrato
    if (formData.inquilino.trim() && !formData.fechaInicioContrato) {
      newErrors.fechaInicioContrato =
        "Si hay inquilino, la fecha de inicio del contrato es obligatoria";
    }

    // Validar duración del contrato
    if (
      formData.inquilino.trim() &&
      (!formData.duracionContrato || formData.duracionContrato <= 0)
    ) {
      newErrors.duracionContrato =
        "Si hay inquilino, la duración del contrato debe ser mayor a 0";
    }

    // Validar precio de alquiler
    if (!formData.precioAlquiler || formData.precioAlquiler <= 0) {
      newErrors.precioAlquiler = "El precio de alquiler debe ser mayor a 0";
    }

    // Validar intervalo de aumento
    if (
      formData.inquilino.trim() &&
      (!formData.intervaloAumento || formData.intervaloAumento <= 0)
    ) {
      newErrors.intervaloAumento =
        "Si hay inquilino, el intervalo de aumento debe ser mayor a 0";
    }

    // Validar dirección
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección de la propiedad es obligatoria";
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  }, [formData]);

  return { errors, isValid };
}
