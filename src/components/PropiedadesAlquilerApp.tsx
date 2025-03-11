"use client";

import { useState, useEffect } from "react";
import PropiedadAlquilerForm from "./PropiedadAlquilerForm";
import ListaPropiedadesAlquiler from "./ListaPropiedadesAlquiler";
import { usePropiedadesAlquiler } from "../hooks/usePropiedadesAlquiler";
import { onAuthStateChange } from "../lib/firebaseUtils";

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

  // Escuchar cambios en la autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChange((isAuth) => {
      setMostrarApp(isAuth);
    });

    return () => unsubscribe();
  }, []);

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
            <PropiedadAlquilerForm onSubmit={agregarPropiedad} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <ListaPropiedadesAlquiler
              propiedades={propiedades}
              isLoading={isLoading}
              onActualizar={actualizarPropiedad}
              onEliminar={eliminarPropiedad}
            />
          </div>
        </div>
      )}
    </div>
  );
}
