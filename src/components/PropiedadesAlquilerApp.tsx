"use client";

import { useState, useEffect } from "react";
import { onAuthStateChange } from "../lib/firebaseUtils.js";
import ListaPropiedadesAlquiler from "./ListaPropiedadesAlquiler.tsx";
import { PropiedadesProvider } from "../context/PropiedadesContext.js";

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
      <div className="container mx-auto px-4 py-8">
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
