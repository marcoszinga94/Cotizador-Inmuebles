"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { DatosPropiedad } from "./DatosPropiedad";
import { DatosTerreno } from "./DatosTerreno";
import { ResultadosCotizacion } from "./ResultadosCotizacion";
import { HistorialCotizaciones } from "./HistorialCotizaciones";
import { Boton } from "./Boton";
import { useFormValidation } from "../hooks/useFormValidation";
import { useDolarApi } from "../hooks/useDolarApi";
import { useCalculations } from "../hooks/useCalculations";
import { useHistorialCotizaciones } from "../hooks/useHistorialCotizaciones";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { FormData, HistorialItem } from "../types/formTypes";
import { onAuthStateChange } from "../lib/firebaseUtils";

const initialFormData: FormData = {
  propiedad: "",
  terreno: "",
  valorResidual: 0,
  valorReposicion: 0,
  anosPropiedad: 0,
  estadoPropiedad: 1,
  cantidadM2: 0,
  valorM2: 0,
  dolarHoy: 0,
};

const valorDolar = async () => {
  const response = await fetch("https://dolarapi.com/v1/dolares/blue");
  const data = await response.json();
  return data.blue.toFixed(2);
};

export default function TasadorForm() {
  const [formData, setFormData] = useLocalStorage<FormData>(
    "tasador_form_data",
    initialFormData
  );

  // Estado para controlar la autenticación y errores
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isLoading: true,
    error: null as string | null,
    initError: null as Error | null,
  });

  // Hooks personalizados
  const { errors, validateField, validateAllFields } = useFormValidation();
  const {
    valor: dolarValor,
    loading: dolarLoading,
    error: dolarError,
    fetchDolar,
  } = useDolarApi();
  const resultados = useCalculations(formData);
  const { historial, guardarCotizacion, cargarCotizacion, eliminarCotizacion } =
    useHistorialCotizaciones();

  // Estado para animaciones
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Efecto para observar cambios en la autenticación
  useEffect(() => {
    let isMounted = true;
    let unsubscribe: (() => void) | undefined;

    const initializeAuth = async () => {
      try {
        if (!isMounted) return;

        unsubscribe = onAuthStateChange((authenticated) => {
          if (!isMounted) return;

          setAuthState((prev) => ({
            ...prev,
            isAuthenticated: authenticated,
            isLoading: false,
            error: null,
            initError: null,
          }));

          // Solo limpiar datos si el usuario no está autenticado y había estado autenticado previamente
          if (!authenticated && authState.isAuthenticated) {
            setFormData(initialFormData);
            localStorage.removeItem("historial_cotizaciones");
          }
        });
      } catch (err) {
        if (!isMounted) return;

        console.error("Error en la inicialización:", err);

        setAuthState((prev) => ({
          ...prev,
          initError:
            err instanceof Error ? err : new Error("Error desconocido"),
          error:
            err instanceof Error
              ? err.message
              : "Error desconocido al inicializar la autenticación",
          isLoading: false,
        }));
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (typeof unsubscribe === "function") {
        try {
          unsubscribe();
        } catch (error) {
          console.error("Error al limpiar suscripción:", error);
        }
      }
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  // Componente de error
  const ErrorDisplay = ({ error }: { error: string }) => (
    <div
      className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4"
      role="alert"
    >
      <p className="font-bold">Error</p>
      <p>{error}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
      >
        Recargar página
      </button>
    </div>
  );

  // Mostrar estado de carga inicial con un retraso mínimo para evitar parpadeos
  if (authState.isLoading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center opacity-0 animate-fadeIn">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mostrar error si existe
  if (authState.error || authState.initError) {
    return (
      <ErrorDisplay
        error={
          authState.error || authState.initError?.message || "Error desconocido"
        }
      />
    );
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    // Convertir a número si es necesario
    if (
      name !== "propiedad" &&
      name !== "terreno" &&
      name !== "estadoPropiedad"
    ) {
      parsedValue = value === "" ? 0 : parseFloat(value);
    }

    setFormData({
      ...formData,
      [name]: parsedValue,
    });

    // Validar el campo
    validateField(name as keyof FormData, parsedValue);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isValid = validateAllFields(formData);

    if (isValid) {
      setIsSubmitting(true);

      // Simular un tiempo de procesamiento
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);

        // Ocultar el mensaje de éxito después de 2 segundos
        setTimeout(() => setShowSuccess(false), 2000);

        // Guardar la cotización en el historial
        guardarCotizacion(formData, resultados);
      }, 500);
    }
  };

  const handleCargarDolar = async () => {
    await fetchDolar();
    if (dolarValor) {
      setFormData({
        ...formData,
        dolarHoy: dolarValor,
      });
    }
  };

  const handleCargarCotizacion = (item: HistorialItem) => {
    cargarCotizacion(item);
    setFormData({
      propiedad: item.propiedad,
      terreno: item.terreno,
      valorResidual: item.valorResidual,
      valorReposicion: item.valorReposicion,
      anosPropiedad: item.anosPropiedad,
      estadoPropiedad: item.estadoPropiedad,
      cantidadM2: item.cantidadM2,
      valorM2: item.valorM2,
      dolarHoy: item.dolarHoy,
    });
  };

  return (
    <div className="p-6">
      <p className="text-2xl font-bold mb-6 text-center text-rosaOscuro relative">
        Tasador de Propiedades
      </p>

      {!authState.isAuthenticated ? (
        <div className="text-center p-4 bg-yellow-100 rounded-lg">
          <p className="text-yellow-800">
            Debes iniciar sesión para usar el tasador
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 p-4 rounded-lg bg-white/50 dark:bg-grisOscuro/10">
                <DatosPropiedad
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  coeficienteK={resultados.coeficienteK}
                />
              </div>

              <div className="space-y-4 p-4 rounded-lg bg-white/50 dark:bg-grisOscuro/10">
                <DatosTerreno
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                  onCargarDolar={handleCargarDolar}
                  dolarLoading={dolarLoading}
                  dolarError={dolarError}
                />
                <div className="slide-in">
                  <ResultadosCotizacion
                    formData={formData}
                    resultados={resultados}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 relative">
              <Boton
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Guardar Tasación
              </Boton>
              {showSuccess && (
                <div className="absolute top-0 bottom-0 p-2 bg-green-100 text-green-800 rounded-md text-center animate-fadeInOut">
                  ¡Cotización guardada con éxito!
                </div>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 gap-6">
            <div className="fade-in">
              <HistorialCotizaciones
                historial={historial}
                onCargarCotizacion={handleCargarCotizacion}
                onEliminarCotizacion={eliminarCotizacion}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
