"use client";

import { useState, useEffect } from "react";
import { onAuthStateChange } from "../lib/firebaseUtils.ts";
import ListaPropiedadesAlquiler from "./ListaPropiedadesAlquiler.tsx";
import { PropiedadesProvider } from "../context/PropiedadesContext.tsx";

export default function PropiedadesAlquilerApp() {
  const [mostrarApp, setMostrarApp] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setMostrarApp(!!user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <PropiedadesProvider>
      <div className="container mx-auto px-2 py-4">
        {!mostrarApp ? (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded-md text-center">
            <p>Por favor, inicia sesión para ver las propiedades.</p>
          </div>
        ) : (
          <ListaPropiedadesAlquiler />
        )}
      </div>
    </PropiedadesProvider>
  );
}
