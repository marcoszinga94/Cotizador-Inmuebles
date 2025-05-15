import { useState, useEffect } from "react";

interface DolarData {
  valor: number;
  loading: boolean;
  error: string | null;
  fetchDolar: () => Promise<void>;
}

export const useDolarApi = (): DolarData => {
  const [valor, setValor] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDolar = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://dolarapi.com/v1/dolares/blue");

      if (!response.ok) {
        throw new Error(
          `Error al obtener el valor del dólar: ${response.status}`
        );
      }

      const data = await response.tson();
      setValor(Number(data.venta));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al obtener el valor del dólar"
      );
      console.error("Error al obtener el valor del dólar:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar el valor del dólar automáticamente al montar el componente
  useEffect(() => {
    fetchDolar();
  }, []);

  return { valor, loading, error, fetchDolar };
};
