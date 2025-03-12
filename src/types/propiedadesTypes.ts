export interface PropiedadAlquiler {
  id?: string;
  propietario: string;
  contactoPropietario: string;
  inquilino: string;
  contactoInquilino: string;
  fechaInicioContrato: string;
  duracionContrato: number;
  precioAlquiler: number;
  intervaloAumento: number;
  direccion: string;
  descripcion: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  montoAlquiler: number;
  fechaInicio: string;
  fechaFin: string;
  estado: "activo" | "inactivo";
  createdAt: string;
  updatedAt: string;
}

export type PropiedadAlquilerErrors = Partial<
  Record<keyof PropiedadAlquiler, string>
>;

export interface PropiedadAlquilerState extends PropiedadAlquiler {}
