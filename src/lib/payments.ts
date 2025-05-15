import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  getDocs,
} from "@firebase/firestore";
import type { Payment, PaymentFormData } from "../types/paymentTypes.ts";

// Función para obtener los pagos de una propiedad en un mes específico
export async function getPaymentsByMonth(
  propertyId: string,
  year: number,
  month: number // month is 0-indexed (0 for January, 11 for December)
): Promise<Payment[]> {
  try {
    const db = getFirestore();
    if (!db) throw new Error("Firestore no está inicializado");

    const paymentsRef = collection(db, "payments");

    // Calcular el primer y último día del mes como cadenas "YYYY-MM-DD"
    // El mes en JavaScript Date es 0-indexado, igual que el parámetro 'month'
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0); // El día 0 del mes siguiente es el último día del mes actual

    const startDateString = `${firstDayOfMonth.getFullYear()}-${String(
      firstDayOfMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(firstDayOfMonth.getDate()).padStart(2, "0")}`;
    const endDateString = `${lastDayOfMonth.getFullYear()}-${String(
      lastDayOfMonth.getMonth() + 1
    ).padStart(2, "0")}-${String(lastDayOfMonth.getDate()).padStart(2, "0")}`;

    console.log(
      `[getPaymentsByMonth] Querying for propertyId: ${propertyId}, Year: ${year}, Month: ${month} (0-indexed)`
    );
    console.log(
      `[getPaymentsByMonth] Date range (string comparison): ${startDateString} TO ${endDateString}`
    );

    const q = query(
      paymentsRef,
      where("propertyId", "==", propertyId),
      where("date", ">=", startDateString), // Comparar como cadenas
      where("date", "<=", endDateString) // Comparar como cadenas
    );

    const querySnapshot = await getDocs(q);
    const payments: Payment[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      let processedDate = data.date;

      if (processedDate && typeof processedDate.toDate === "function") {
        // Firestore Timestamp
        const jsDate = processedDate.toDate();
        processedDate = `${jsDate.getFullYear()}-${String(
          jsDate.getMonth() + 1
        ).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
      } else if (processedDate instanceof Date) {
        // JavaScript Date object
        processedDate = `${processedDate.getFullYear()}-${String(
          processedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(processedDate.getDate()).padStart(
          2,
          "0"
        )}`;
      }
      // If processedDate is already a 'YYYY-MM-DD' string, it remains as is.
      // Ensure it is a string if it was some other type not handled above.
      else if (typeof processedDate !== "string") {
        console.warn(
          `[getPaymentsByMonth] Date for payment ${
            doc.id
          } (property: ${propertyId}) was of unexpected type: ${typeof processedDate}. Value: ${JSON.stringify(
            processedDate
          )}. Attempting to convert.`
        );
        try {
          // Attempt to create a Date object and then format. This handles numbers (timestamps) or other parsable date strings.
          const d = new Date(processedDate);
          if (!isNaN(d.getTime())) {
            // Check if date is valid
            processedDate = `${d.getFullYear()}-${String(
              d.getMonth() + 1
            ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          } else {
            console.error(
              `[getPaymentsByMonth] Could not parse date for payment ${doc.id}: ${processedDate}`
            );
            processedDate = "Invalid Date"; // Fallback for unparseable dates
          }
        } catch (e) {
          console.error(
            `[getPaymentsByMonth] Error converting date for payment ${doc.id}: ${processedDate}`,
            e
          );
          processedDate = "Error Converting Date"; // Fallback
        }
      }

      payments.push({ id: doc.id, ...data, date: processedDate } as Payment);
    });
    console.log(
      `[getPaymentsByMonth] Found ${payments.length} payments for propertyId: ${propertyId}, Year: ${year}, Month: ${month}.`
    );

    return payments;
  } catch (error) {
    console.error("Error al obtener los pagos desde Firestore:", error);
    return [];
  }
}

// Función para obtener un pago por su ID desde Firestore
export async function getPaymentById(id: string): Promise<Payment | null> {
  try {
    const db = getFirestore();
    if (!db) {
      console.error("Firestore no está inicializado en getPaymentById");
      throw new Error("Firestore no está inicializado");
    }

    const paymentRef = doc(db, "payments", id);
    const docSnap = await getDoc(paymentRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Procesar la fecha si es necesario, similar a getPaymentsByMonth
      let processedDate = data.date;
      if (processedDate && typeof processedDate.toDate === "function") {
        const jsDate = processedDate.toDate();
        processedDate = `${jsDate.getFullYear()}-${String(
          jsDate.getMonth() + 1
        ).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
      } else if (processedDate instanceof Date) {
        processedDate = `${processedDate.getFullYear()}-${String(
          processedDate.getMonth() + 1
        ).padStart(2, "0")}-${String(processedDate.getDate()).padStart(
          2,
          "0"
        )}`;
      }
      // Si ya es string 'YYYY-MM-DD', se queda como está.

      return { id: docSnap.id, ...data, date: processedDate } as Payment;
    } else {
      console.log(`[getPaymentById] No se encontró el documento con ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error(
      `Error al obtener el pago con ID ${id} desde Firestore:`,
      error
    );
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
      id: doc(paymentsRef).id, // Genera un ID único para el nuevo pago
      ...paymentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = doc(paymentsRef, nuevoPago.id); // Referencia al documento con el ID generado
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

    // Prepara los datos para actualizar, excluyendo 'id' y 'createdAt' si no deben modificarse
    const updateData: Partial<Payment> = {
      ...paymentData,
      updatedAt: new Date().toISOString(),
    };
    // Elimina campos que no deberían estar en la actualización si es necesario
    // delete updateData.id;
    // delete updateData.createdAt;

    await updateDoc(paymentRef, updateData);

    // Después de actualizar, obtén el documento completo para devolverlo
    const updatedDocSnap = await getDoc(paymentRef);
    if (!updatedDocSnap.exists()) {
      throw new Error(
        `No se encontró el documento con ID ${id} después de actualizar.`
      );
    }

    // Procesar la fecha del documento actualizado
    const data = updatedDocSnap.data();
    let processedDate = data.date;
    if (processedDate && typeof processedDate.toDate === "function") {
      const jsDate = processedDate.toDate();
      processedDate = `${jsDate.getFullYear()}-${String(
        jsDate.getMonth() + 1
      ).padStart(2, "0")}-${String(jsDate.getDate()).padStart(2, "0")}`;
    } else if (processedDate instanceof Date) {
      processedDate = `${processedDate.getFullYear()}-${String(
        processedDate.getMonth() + 1
      ).padStart(2, "0")}-${String(processedDate.getDate()).padStart(2, "0")}`;
    }

    return { id: updatedDocSnap.id, ...data, date: processedDate } as Payment;
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido al actualizar el pago";
    console.error("Error al actualizar el pago:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      paymentId: id,
      paymentData,
      timestamp: new Date().toISOString(),
    });
    throw new Error(`No se pudo actualizar el pago: ${errorMessage}`);
  }
}

// Función para eliminar un pago
export async function deletePayment(id: string): Promise<void> {
  try {
    const db = getFirestore();
    if (!db) throw new Error("Firestore no está inicializado");
    const paymentRef = doc(db, "payments", id);
    await deleteDoc(paymentRef);
    console.log(
      `[deletePayment] Documento con ID: ${id} eliminado exitosamente.`
    );
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
