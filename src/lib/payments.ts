import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
} from "@firebase/firestore";
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
    if (!paymentData?.propertyId) {
      throw new Error(
        "Se requiere el ID de la propiedad (propertyId) para registrar un pago"
      );
    }

    const db = getFirestore();
    if (!db) throw new Error("Firestore no está inicializado");

    const paymentsRef = collection(db, "payments");
    const nuevoPago: Payment = {
      id: doc(paymentsRef).id,
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = doc(paymentsRef, nuevoPago.id);
    console.log("Intentando guardar documento en:", docRef.path);

    await setDoc(docRef, nuevoPago);
    console.log("Documento guardado exitosamente");
    return nuevoPago;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al crear el pago";
    console.error("Error al crear el pago:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      paymentData,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`No se pudo crear el pago: ${errorMessage}`);
  }
}

// Función para actualizar un pago existente
export async function updatePayment(
  id: string,
  paymentData: PaymentFormData
): Promise<Payment> {
  try {
    if (!paymentData?.propertyId) {
      throw new Error(
        "Se requiere el ID de la propiedad (propertyId) para actualizar un pago"
      );
    }

    const db = getFirestore();
    if (!db) throw new Error("Firestore no está inicializado");
    const paymentRef = doc(db, "payments", id);

    await updateDoc(paymentRef, {
      ...paymentData,
      updatedAt: new Date().toISOString(),
    });

    const updatedPayment = (await getDoc(paymentRef)).data() as Payment;
    return updatedPayment;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al actualizar el pago";
    console.error("Error al actualizar el pago:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      paymentId: id,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`No se pudo actualizar el pago: ${errorMessage}`);
  }
}

// Función para eliminar un pago
export async function deletePayment(id: string): Promise<void> {
  try {
    const db = getFirestore();
    const paymentRef = doc(db, "payments", id);
    await deleteDoc(paymentRef);
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al eliminar el pago";
    console.error("Error al eliminar el pago:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      paymentId: id,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`No se pudo eliminar el pago: ${errorMessage}`);
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
