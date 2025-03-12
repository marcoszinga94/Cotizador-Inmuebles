"use client";

import { useState } from "react";
import { Boton } from "./Boton.tsx";
import { usePropiedades } from "../context/PropiedadesContext.js";
import PropiedadAlquilerForm from "./PropiedadAlquilerForm.tsx";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.js";

export default function ListaPropiedadesAlquiler() {
  const {
    propiedades,
    isLoading,
    agregarNuevaPropiedad,
    actualizarPropiedadExistente,
    eliminarPropiedadExistente,
  } = usePropiedades();
  const [confirmandoEliminacion, setConfirmandoEliminacion] = useState<
    string | null
  >(null);
  const [propiedadesExpandidas, setPropiedadesExpandidas] = useState<string[]>(
    []
  );
  const [propiedadEditando, setPropiedadEditando] =
    useState<PropiedadAlquiler | null>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const toggleExpansion = (propiedadId: string) => {
    setPropiedadesExpandidas((prev) =>
      prev.includes(propiedadId)
        ? prev.filter((id) => id !== propiedadId)
        : [...prev, propiedadId]
    );
  };

  const estaExpandida = (propiedadId: string) => {
    return propiedadesExpandidas.includes(propiedadId);
  };

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

  const handleConfirmarEliminacion = (propiedadId: string) => {
    setConfirmandoEliminacion(propiedadId);
  };

  const handleEliminar = async (propiedadId: string) => {
    const resultado = await eliminarPropiedadExistente(propiedadId);
    setConfirmandoEliminacion(null);
    return resultado;
  };

  const handleCancelarEliminacion = () => {
    setConfirmandoEliminacion(null);
  };

  const handleEditar = (propiedad: PropiedadAlquiler) => {
    setPropiedadEditando(propiedad);
    setMostrarFormulario(true);
  };

  const handleCancelarEdicion = () => {
    setPropiedadEditando(null);
    setMostrarFormulario(false);
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-rosaOscuro">
          Propiedades en Alquiler
        </h2>
        <Boton
          onClick={() => setMostrarFormulario(true)}
          className="bg-primary hover:bg-rosaOscuro text-white"
        >
          Agregar Propiedad
        </Boton>
      </div>

      {mostrarFormulario && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-rosaOscuro">
              {propiedadEditando
                ? "Editar Propiedad"
                : "Agregar Nueva Propiedad"}
            </h3>
            <Boton
              onClick={handleCancelarEdicion}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800"
            >
              Cancelar
            </Boton>
          </div>
          <PropiedadAlquilerForm
            propiedadInicial={propiedadEditando}
            onSubmit={
              propiedadEditando
                ? actualizarPropiedadExistente.bind(null, propiedadEditando.id!)
                : agregarNuevaPropiedad
            }
            isEditing={!!propiedadEditando}
            onCancel={handleCancelarEdicion}
          />
        </div>
      )}

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
              <div
                className="bg-gray-50 px-6 py-4 border-b border-gray-200 cursor-pointer"
                onClick={() => toggleExpansion(propiedad.id!)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="mr-2">
                      {estaExpandida(propiedad.id!) ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-rosaOscuro"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-rosaOscuro"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
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
                  </div>
                  <div
                    className="flex space-x-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Boton
                      onClick={() => handleEditar(propiedad)}
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

              {estaExpandida(propiedad.id!) && (
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
                        Datos de la Propiedad
                      </h4>
                      <p>
                        <span className="font-medium">Dirección:</span>{" "}
                        {propiedad.direccion}
                      </p>
                      <p>
                        <span className="font-medium">Descripción:</span>{" "}
                        {propiedad.descripcion || "Sin descripción"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
