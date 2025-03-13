import { obtenerPropiedadAlquilerPorId } from "../../lib/propiedadesFirestore.ts";

export async function GET({ params }: { params: { id: string } }) {
  const { id } = params;
  const propiedad = await obtenerPropiedadAlquilerPorId(id);
  return new Response(JSON.stringify(propiedad), {
    headers: { "Content-Type": "application/json" },
  });
}
