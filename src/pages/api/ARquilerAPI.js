import { obtenerPropiedadesAlquiler } from "../../lib/propiedadesFirestore.ts";


const peticionApiIpc = async (amount, date, months, rate = 'ipc') => {
  const url = 'https://arquilerapi1.p.rapidapi.com/calculate';
  const options = {
    method: 'POST',
    headers: {
      'x-rapidapi-key': 'fa22f1ce94mshf9ef877692059cep164bedjsnc894b023bc92',
      'x-rapidapi-host': 'arquilerapi1.p.rapidapi.com',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amount,
      date: date,
      months: months,
      rate: rate
    })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const propiedades = await obtenerPropiedadesAlquiler();
      const nuevosMontos = [];

      for (const propiedad of propiedades) {
        try {
          const resultado = await peticionApiIpc(
            propiedad.montoAlquiler,
            propiedad.fechaInicioContrato,
            propiedad.duracionContrato
          );
          nuevosMontos.push({ propiedadId: propiedad.id, resultado });
        } catch (error) {
          console.error(`Error al calcular el nuevo monto para la propiedad ${propiedad.id}:`, error);
          nuevosMontos.push({ propiedadId: propiedad.id, error: error.message });
        }
      }

      res.status(200).json(nuevosMontos);
    } catch (error) {
      console.error("Error al obtener las propiedades:", error);
      res.status(500).json({ error: "Error al obtener las propiedades" });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}