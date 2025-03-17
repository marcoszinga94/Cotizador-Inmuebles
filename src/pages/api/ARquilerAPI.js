import { obtenerPropiedadesAlquiler } from "../../lib/propiedadesFirestore.ts";


const calculateNewRent = async (amount, date, months, rate = 'ipc') => {
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

const calcularNuevosMontos = async () => {
  try {
    const propiedades = await obtenerPropiedadesAlquiler();

    for (const propiedad of propiedades) {
      try {
        const resultado = await calculateNewRent(
          propiedad.montoAlquiler,
          propiedad.fechaInicioContrato,
          propiedad.duracionContrato
        );
        console.log(`Nuevo monto para la propiedad ${propiedad.id}:`, resultado);
      } catch (error) {
        console.error(`Error al calcular el nuevo monto para la propiedad ${propiedad.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error al obtener las propiedades:", error);
  }
};

calcularNuevosMontos();