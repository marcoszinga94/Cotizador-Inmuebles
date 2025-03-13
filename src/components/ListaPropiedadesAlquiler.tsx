"use client";

import { useState } from "react";
import { Boton } from "./Boton.tsx";
import { usePropiedades } from "../context/PropiedadesContext.js";
import PropiedadAlquilerForm from "./PropiedadAlquilerForm.tsx";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.js";

type Ordenamiento = "propietario" | "inquilino" | "precio" | "fechaInicio";

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
  const [busqueda, setBusqueda] = useState("");
  const [ordenamiento, setOrdenamiento] = useState<Ordenamiento>("propietario");

  // Filtrar propiedades basado en la búsqueda
  const propiedadesFiltradas = propiedades.filter((propiedad) => {
    const terminoBusqueda = busqueda.toLowerCase();
    return (
      propiedad.propietario.toLowerCase().includes(terminoBusqueda) ||
      (propiedad.inquilino?.toLowerCase().includes(terminoBusqueda) ?? false) ||
      propiedad.direccion.toLowerCase().includes(terminoBusqueda)
    );
  });

  // Ordenar propiedades
  const propiedadesOrdenadas = [...propiedadesFiltradas].sort((a, b) => {
    switch (ordenamiento) {
      case "propietario":
        return a.propietario.localeCompare(b.propietario);
      case "inquilino":
        return (a.inquilino || "").localeCompare(b.inquilino || "");
      case "precio":
        return b.precioAlquiler - a.precioAlquiler;
      case "fechaInicio":
        return (
          new Date(b.fechaInicioContrato || "").getTime() -
          new Date(a.fechaInicioContrato || "").getTime()
        );
      default:
        return 0;
    }
  });

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
    <div className="p-6 bg-rosaClaro rounded-lg shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mb-4 gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rosaOscuro text-sm sm:text-base"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <select
            value={ordenamiento}
            onChange={(e) => setOrdenamiento(e.target.value as Ordenamiento)}
            className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-rosaOscuro text-sm sm:text-base bg-white"
          >
            <option value="propietario">Ordenar por Propietario</option>
            <option value="inquilino">Ordenar por Inquilino</option>
            <option value="precio">Ordenar por Precio</option>
            <option value="fechaInicio">Ordenar por Fecha de Inicio</option>
          </select>
        </div>
        <Boton
          onClick={() => setMostrarFormulario(true)}
          className="w-full sm:w-auto bg-primary hover:bg-rosaOscuro text-white text-sm sm:text-base px-4 py-2"
        >
          Agregar Propiedad
        </Boton>
      </div>

      {mostrarFormulario && (
        <div className="bg-white p-4 rounded-md shadow-sm mb-4">
          <h3 className="flex text-2xl justify-center font-semibold text-rosaOscuro mb-4">
            {propiedadEditando ? "Editar Propiedad" : "Agregar Nueva Propiedad"}
          </h3>
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

      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {propiedadesOrdenadas.length === 0 ? (
          <div className="bg-white p-4 text-center rounded-md shadow-sm">
            <p className="text-gray-500">
              No hay propiedades que coincidan con la búsqueda
            </p>
          </div>
        ) : (
          propiedadesOrdenadas.map((propiedad) => (
            <div
              key={propiedad.id}
              className="bg-white p-3 rounded-md shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-rosaOscuro">
                    Propiedad de{" "}
                    <span className="font-bold">{propiedad.propietario}</span>
                  </h3>
                  <p className="text-xs text-gray-500">
                    {propiedad.inquilino
                      ? `Alquilada a ${propiedad.inquilino}`
                      : "Disponible"}
                  </p>
                </div>

                <div className="flex space-x-2">
                  <Boton
                    onClick={() =>
                      (window.location.href = `/propiedades/${propiedad.id}`)
                    }
                    variant="primary"
                    className="p-1"
                    aria-label="Ver pagos"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </Boton>

                  <Boton
                    onClick={() => handleEditar(propiedad)}
                    variant="primary"
                    className="p-1"
                    aria-label="Editar propiedad"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </Boton>

                  {confirmandoEliminacion === propiedad.id ? (
                    <div className="flex space-x-1">
                      <Boton
                        onClick={handleCancelarEliminacion}
                        variant="secondary"
                        className="p-1"
                        aria-label="Cancelar eliminación"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </Boton>
                      <Boton
                        onClick={() => handleEliminar(propiedad.id!)}
                        variant="danger"
                        className="p-1"
                        aria-label="Confirmar eliminación"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </Boton>
                    </div>
                  ) : (
                    <Boton
                      onClick={() => handleConfirmarEliminacion(propiedad.id!)}
                      variant="danger"
                      className="p-1"
                      aria-label="Eliminar propiedad"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </Boton>
                  )}

                  <Boton
                    onClick={() => toggleExpansion(propiedad.id!)}
                    variant="secondary"
                    className="p-1"
                    aria-label={
                      estaExpandida(propiedad.id!)
                        ? "Colapsar detalles"
                        : "Expandir detalles"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`size-5 transform transition-transform duration-300 ${
                        estaExpandida(propiedad.id!) ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </Boton>
                </div>
              </div>

              {estaExpandida(propiedad.id!) && (
                <div className="mt-3 text-sm text-gray-600 animate-[fadeIn_0.3s_ease-in-out]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-rosaOscuro mb-2">
                        Datos del Propietario
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span>Nombre:</span>
                        <span className="font-medium">
                          {propiedad.propietario}
                        </span>
                        <span>Contacto:</span>
                        <span className="font-medium">
                          {propiedad.contactoPropietario}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-rosaOscuro mb-2">
                        Datos del Inquilino
                      </h4>
                      {propiedad.inquilino ? (
                        <div className="grid grid-cols-2 gap-2">
                          <span>Nombre:</span>
                          <span className="font-medium">
                            {propiedad.inquilino}
                          </span>
                          <span>Contacto:</span>
                          <span className="font-medium">
                            {propiedad.contactoInquilino || "No especificado"}
                          </span>
                        </div>
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
                      <div className="grid grid-cols-2 gap-2">
                        <span>Precio:</span>
                        <span className="font-medium">
                          ${propiedad.precioAlquiler.toLocaleString("es-AR")}
                        </span>
                        {propiedad.inquilino && (
                          <>
                            <span>Inicio:</span>
                            <span className="font-medium">
                              {formatearFecha(propiedad.fechaInicioContrato)}
                            </span>
                            <span>Duración:</span>
                            <span className="font-medium">
                              {propiedad.duracionContrato} meses
                            </span>
                            <span>Finalización:</span>
                            <span className="font-medium">
                              {calcularFechaFinContrato(
                                propiedad.fechaInicioContrato,
                                propiedad.duracionContrato
                              )}
                            </span>
                            <span>Aumento cada:</span>
                            <span className="font-medium">
                              {propiedad.intervaloAumento} meses
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-rosaOscuro mb-2">
                        Datos de la Propiedad
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        <span>Dirección:</span>
                        <span className="font-medium">
                          {propiedad.direccion}
                        </span>
                        <span>Descripción:</span>
                        <span className="font-medium">
                          {propiedad.descripcion || "Sin descripción"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
