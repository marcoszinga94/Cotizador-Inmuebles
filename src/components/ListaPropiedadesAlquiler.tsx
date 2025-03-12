"use client";

import { useState } from "react";
import { Boton } from "./Boton";
import type { PropiedadAlquiler } from "../types/propiedadesTypes";

interface ListaPropiedadesAlquilerProps {
  propiedades: PropiedadAlquiler[];
  onActualizar: (
    propiedadId: string,
    propiedad: Partial<PropiedadAlquiler>
  ) => Promise<boolean>;
  onEliminar: (propiedadId: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function ListaPropiedadesAlquiler({
  propiedades,
  onActualizar,
  onEliminar,
  isLoading,
}: ListaPropiedadesAlquilerProps) {
  const [confirmandoEliminacion, setConfirmandoEliminacion] = useState<
    string | null
  >(null);

  // Función para formatear la fecha
  const formatearFecha = (fechaStr: string) => {
    if (!fechaStr) return "No establecida";

    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error al formatear fecha:", error);
      return fechaStr;
    }
  };

  // Función para calcular la fecha de fin del contrato
  const calcularFechaFinContrato = (
    fechaInicio: string,
    duracionMeses: number
  ) => {
    if (!fechaInicio) return "No establecida";

    try {
      const fecha = new Date(fechaInicio);
      fecha.setMonth(fecha.getMonth() + duracionMeses);
      return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error al calcular fecha fin:", error);
      return "Error en cálculo";
    }
  };

  // Función para confirmar eliminación
  const handleConfirmarEliminacion = (propiedadId: string) => {
    setConfirmandoEliminacion(propiedadId);
  };

  // Función para eliminar una propiedad
  const handleEliminar = async (propiedadId: string) => {
    const resultado = await onEliminar(propiedadId);
    setConfirmandoEliminacion(null);
    return resultado;
  };

  // Función para cancelar la eliminación
  const handleCancelarEliminacion = () => {
    setConfirmandoEliminacion(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-rosaOscuro">
        Propiedades en Alquiler
      </h2>

      {propiedades.length === 0 ? (
        <div className="bg-gray-50 p-8 text-center rounded-lg border border-gray-200">
          <p className="text-gray-600">No hay propiedades registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {propiedades.map((propiedad) => (
            <div
              key={propiedad.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-rosaOscuro">
                      {propiedad.propietario}
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {propiedad.inquilino
                        ? `Alquilada a ${propiedad.inquilino}`
                        : "Disponible para alquilar"}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Boton
                      onClick={() => onActualizar(propiedad.id!, propiedad)}
                      className="bg-primary hover:bg-rosaOscuro text-white"
                    >
                      Editar
                    </Boton>

                    {confirmandoEliminacion === propiedad.id ? (
                      <div className="flex space-x-2">
                        <Boton
                          onClick={handleCancelarEliminacion}
                          className="bg-gray-300 hover:bg-grisOscuro hover:text-negro text-white"
                        >
                          Cancelar
                        </Boton>
                        <Boton
                          onClick={() => handleEliminar(propiedad.id!)}
                          className="bg-rosaOscuro hover:bg-rosaOscuro text-white"
                        >
                          Confirmar
                        </Boton>
                      </div>
                    ) : (
                      <Boton
                        onClick={() =>
                          handleConfirmarEliminacion(propiedad.id!)
                        }
                        className="bg-rosaOscuro hover:bg-rosaOscuro text-white"
                      >
                        Eliminar
                      </Boton>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 text-primary">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-rosaOscuro mb-2">
                      Datos del Propietario
                    </h4>
                    <p>
                      <span className="font-medium">Nombre:</span>{" "}
                      {propiedad.propietario}
                    </p>
                    <p>
                      <span className="font-medium">Contacto:</span>{" "}
                      {propiedad.contactoPropietario}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-rosaOscuro mb-2">
                      Datos del Inquilino
                    </h4>
                    {propiedad.inquilino ? (
                      <>
                        <p>
                          <span className="font-medium">Nombre:</span>{" "}
                          {propiedad.inquilino}
                        </p>
                        <p>
                          <span className="font-medium">Contacto:</span>{" "}
                          {propiedad.contactoInquilino || "No especificado"}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-500 italic">
                        Sin inquilino actualmente
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-rosaOscuro mb-2">
                      Datos del Contrato
                    </h4>
                    <p>
                      <span className="font-medium">Precio:</span> $
                      {propiedad.precioAlquiler.toLocaleString("es-AR")}
                    </p>
                    {propiedad.inquilino && (
                      <>
                        <p>
                          <span className="font-medium">Inicio:</span>{" "}
                          {formatearFecha(propiedad.fechaInicioContrato)}
                        </p>
                        <p>
                          <span className="font-medium">Duración:</span>{" "}
                          {propiedad.duracionContrato} meses
                        </p>
                        <p>
                          <span className="font-medium">Finalización:</span>{" "}
                          {calcularFechaFinContrato(
                            propiedad.fechaInicioContrato,
                            propiedad.duracionContrato
                          )}
                        </p>
                        <p>
                          <span className="font-medium">Aumento cada:</span>{" "}
                          {propiedad.intervaloAumento} meses
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-rosaOscuro mb-2">
                      Descripción
                    </h4>
                    <p className="text-gray-600">
                      {propiedad.descripcion || "Sin descripción"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
