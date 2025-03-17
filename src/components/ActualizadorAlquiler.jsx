import React, { useState } from "react";

const CalculadorAlquileres = () => {
  const [cargando, setCargando] = useState(false);
  const [resultados, setResultados] = useState(null);

  const calcularNuevosMontos = async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/ARquilerAPI", { method: "POST" });
      const data = await response.json();
      setResultados(data);
    } catch (error) {
      console.error("Error al calcular el nuevo monto:", error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <button onClick={calcularNuevosMontos} disabled={cargando}>
        {cargando ? "Calculando..." : "Calcular Nuevos Montos"}
      </button>
      {resultados && (
        <div>
          <h3>Resultados:</h3>
          <pre>{JSON.stringify(resultados, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default CalculadorAlquileres;
