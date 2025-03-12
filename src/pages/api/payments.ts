import type { APIRoute } from "astro";
import { createPayment } from "../../lib/payments.js";

export const post: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Validar los datos
    if (!data.propertyId || !data.date || !data.amount) {
      return new Response(
        JSON.stringify({
          error: "Faltan datos requeridos",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Crear el pago
    const payment = await createPayment({
      propertyId: data.propertyId,
      date: data.date,
      amount: data.amount,
      observations: data.observations,
    });

    return new Response(JSON.stringify(payment), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error al crear el pago:", error);
    return new Response(
      JSON.stringify({
        error: "Error al crear el pago",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
