import type { PropiedadAlquiler } from "../types/propiedadesTypes.js";

export interface Property {
  id: string;
  name: string;
  address: string;
  monthlyRent: number;
  createdAt: string;
  updatedAt: string;
}

// Función para obtener una propiedad por su ID
export async function getPropertyById(
  id: string
): Promise<PropiedadAlquiler | null> {
  try {
    // Obtener las propiedades del localStorage solo en el cliente
    if (typeof window !== "undefined") {
      const propiedadesStr = localStorage.getItem("propiedades");
      if (!propiedadesStr) return null;

      const propiedades: PropiedadAlquiler[] = JSON.parse(propiedadesStr);
      const propiedad = propiedades.find((p) => p.id === id);

      if (!propiedad) return null;

      return propiedad;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener la propiedad:", error);
    return null;
  }
}

// Función para obtener todas las propiedades
export async function getAllProperties(): Promise<PropiedadAlquiler[]> {
  try {
    // Obtener las propiedades del localStorage solo en el cliente
    if (typeof window !== "undefined") {
      const propiedadesStr = localStorage.getItem("propiedades");
      if (!propiedadesStr) return [];

      return JSON.parse(propiedadesStr);
    }
    return [];
  } catch (error) {
    console.error("Error al obtener las propiedades:", error);
    return [];
  }
}
