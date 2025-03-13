import type { Payment, PaymentFormData } from "../types/paymentTypes.ts";

// Función para obtener los pagos de una propiedad en un mes específico
export async function getPaymentsByMonth(
  propertyId: string,
  year: number,
  month: number
): Promise<Payment[]> {
  try {
    // Obtener los pagos del localStorage solo en el cliente
    if (typeof window !== "undefined") {
      const pagosStr = localStorage.getItem("pagos");
      if (!pagosStr) return [];

      const pagos: Payment[] = JSON.parse(pagosStr);
      return pagos.filter((pago) => {
        const fechaPago = new Date(pago.date);
        return (
          pago.propertyId === propertyId &&
          fechaPago.getFullYear() === year &&
          fechaPago.getMonth() === month
        );
      });
    }
    return [];
  } catch (error) {
    console.error("Error al obtener los pagos:", error);
    return [];
  }
}

// Función para obtener un pago por su ID
export async function getPaymentById(id: string): Promise<Payment | null> {
  try {
    if (typeof window !== "undefined") {
      const pagosStr = localStorage.getItem("pagos");
      if (!pagosStr) return null;

      const pagos: Payment[] = JSON.parse(pagosStr);
      return pagos.find((pago) => pago.id === id) || null;
    }
    return null;
  } catch (error) {
    console.error("Error al obtener el pago:", error);
    return null;
  }
}

// Función para registrar un nuevo pago
export async function createPayment(
  paymentData: PaymentFormData
): Promise<Payment> {
  try {
    // Obtener los pagos existentes
    const pagosStr = localStorage.getItem("pagos");
    const pagos: Payment[] = pagosStr ? JSON.parse(pagosStr) : [];

    // Crear el nuevo pago
    const nuevoPago: Payment = {
      id: crypto.randomUUID(),
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Agregar el nuevo pago al array
    pagos.push(nuevoPago);

    // Guardar en localStorage
    localStorage.setItem("pagos", JSON.stringify(pagos));

    return nuevoPago;
  } catch (error) {
    console.error("Error al crear el pago:", error);
    throw error;
  }
}

// Función para actualizar un pago existente
export async function updatePayment(
  id: string,
  paymentData: PaymentFormData
): Promise<Payment> {
  try {
    const pagosStr = localStorage.getItem("pagos");
    if (!pagosStr) throw new Error("No hay pagos registrados");

    const pagos: Payment[] = JSON.parse(pagosStr);
    const index = pagos.findIndex((pago) => pago.id === id);

    if (index === -1) throw new Error("Pago no encontrado");

    // Actualizar el pago
    pagos[index] = {
      ...pagos[index],
      ...paymentData,
      updatedAt: new Date().toISOString(),
    };

    // Guardar en localStorage
    localStorage.setItem("pagos", JSON.stringify(pagos));

    return pagos[index];
  } catch (error) {
    console.error("Error al actualizar el pago:", error);
    throw error;
  }
}

// Función para eliminar un pago
export async function deletePayment(id: string): Promise<void> {
  try {
    const pagosStr = localStorage.getItem("pagos");
    if (!pagosStr) throw new Error("No hay pagos registrados");

    const pagos: Payment[] = JSON.parse(pagosStr);
    const index = pagos.findIndex((pago) => pago.id === id);

    if (index === -1) throw new Error("Pago no encontrado");

    // Eliminar el pago
    pagos.splice(index, 1);

    // Guardar en localStorage
    localStorage.setItem("pagos", JSON.stringify(pagos));
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    throw error;
  }
}

// Función para formatear el monto en moneda
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount);
}

// Función para verificar si un día tiene un pago registrado
export function hasPaymentOnDate(payments: Payment[], date: string): boolean {
  return payments.some((payment) => payment.date === date);
}

// Función para obtener el pago de un día específico
export function getPaymentByDate(
  payments: Payment[],
  date: string
): Payment | undefined {
  return payments.find((payment) => payment.date === date);
}
