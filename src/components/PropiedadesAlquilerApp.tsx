"use client";

import { useState, useEffect } from "react";
import PropiedadAlquilerForm from "./PropiedadAlquilerForm.tsx";
import ListaPropiedadesAlquiler from "./ListaPropiedadesAlquiler.tsx";
import { usePropiedadesAlquiler } from "../hooks/usePropiedadesAlquiler.js";
import { onAuthStateChange } from "../lib/firebaseUtils.js";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.js";

export default function PropiedadesAlquilerApp() {
  const {
    propiedades,
    isLoading,
    error,
    isAuthenticated,
    agregarPropiedad,
    actualizarPropiedad,
    eliminarPropiedad,
  } = usePropiedadesAlquiler();

  const [mostrarApp, setMostrarApp] = useState(false);
  const [propiedadEditando, setPropiedadEditando] =
    useState<PropiedadAlquiler | null>(null);

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChange((isAuth) => {
      setMostrarApp(isAuth);
    });

    return () => unsubscribe();
  }, []);

  // Función para manejar la edición de una propiedad
  const handleEditar = (propiedad: PropiedadAlquiler) => {
    setPropiedadEditando(propiedad);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para guardar los cambios de la edición
  const handleGuardarEdicion = async (
    propiedadActualizada: PropiedadAlquiler
  ) => {
    if (!propiedadEditando?.id) return false;

    const resultado = await actualizarPropiedad(
      propiedadEditando.id,
      propiedadActualizada
    );

    if (resultado) {
      setTimeout(() => {
        setPropiedadEditando(null);
      }, 2000); // Cerrar el formulario después de 2 segundos
    }

    return resultado;
  };

  // Función para cancelar la edición
  const handleCancelarEdicion = () => {
    setPropiedadEditando(null);
  };

  return (
    <div className="p-6">
      {!mostrarApp ? (
        <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded-md text-center">
          <p>Inicia sesión para gestionar las propiedades de alquiler</p>
        </div>
      ) : (
        <div className="space-y-10">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow-md">
            {propiedadEditando ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-rosaOscuro">
                    Editar Propiedad
                  </h2>
                  <button
                    onClick={handleCancelarEdicion}
                    className="bg-gray-300 hover:bg-gray-400 text-rosaOscuro px-4 py-2 rounded-md"
                  >
                    Cancelar Edición
                  </button>
                </div>
                <PropiedadAlquilerForm
                  onSubmit={handleGuardarEdicion}
                  propiedadInicial={propiedadEditando}
                  isEditing={true}
                />
              </div>
            ) : (
              <PropiedadAlquilerForm onSubmit={agregarPropiedad} />
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <ListaPropiedadesAlquiler
              propiedades={propiedades}
              isLoading={isLoading}
              onActualizar={(id, propiedad) => {
                // Buscar la propiedad completa para editar
                const propiedadCompleta = propiedades.find((p) => p.id === id);
                if (propiedadCompleta) {
                  handleEditar(propiedadCompleta);
                }
                return Promise.resolve(true);
              }}
              onEliminar={eliminarPropiedad}
            />
          </div>
        </div>
      )}
    </div>
  );
}
