import { useState } from "react";
import type { FormData } from "../types/formTypes.js";

interface ValidationResult {
  errors: Partial<Record<keyof FormData, string>>;
  validateField: (name: keyof FormData, value: string | number) => string;
  validateAllFields: (data: FormData) => boolean;
}

export const useFormValidation = (): ValidationResult => {
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

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
      if (name === "anosPropiedad" && (value < 0 || value > 99)) {
        return "Los años de la propiedad deben estar entre 0 y 99";
      }
      if (name === "estadoPropiedad" && (value < 1 || value > 9)) {
        return "El estado de la propiedad debe estar entre 1 y 9";
      }
    }
    return "";
  };

  const validateAllFields = (data: FormData): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    let hasErrors = false;

    Object.entries(data).forEach(([key, value]) => {
      const error = validateField(
        key as keyof FormData,
        value as string | number
      );
      if (error) {
        newErrors[key as keyof FormData] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  return { errors, validateField, validateAllFields };
};
