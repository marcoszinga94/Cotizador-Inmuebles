export interface FormData {
  propiedad: string;
  terreno: string;
  valorResidual: number;
  valorReposicion: number;
  anosPropiedad: number;
  estadoPropiedad: number;
  cantidadM2: number;
  valorM2: number;
  dolarHoy: number;
}

export interface CalculationResults {
  valorActual: number;
  valorTerreno: number;
  valorTotal: number;
  valorTotalDolares: number;
  coeficienteK: number;
}

export interface FormState extends FormData, CalculationResults {}

export type FormErrors = Partial<Record<keyof FormData, string>>;

export interface HistorialItem {
  id: string;
  fecha: string;
  propiedad: string;
  terreno: string;
  valorResidual: number;
  valorReposicion: number;
  anosPropiedad: number;
  estadoPropiedad: number;
  cantidadM2: number;
  valorM2: number;
  dolarHoy: number;
  resultados: CalculationResults;
}
