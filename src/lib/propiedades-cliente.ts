import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  Firestore,
} from "firebase/firestore";
import { getFirebaseClient } from "./firebase-client.ts";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.ts";

// Procesamiento de datos
const processTimestamp = (timestamp: any) => {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) return timestamp.toDate().toISOString();
  return timestamp;
};

// Operaciones de Firestore - solo para cliente
export const propiedadesCliente = {
  async obtenerTodas() {
    const { db, auth } = getFirebaseClient();

    if (!auth.currentUser) {
      throw new Error("Usuario no autenticado");
    }

    const userId = auth.currentUser.uid;
    const propiedadesQuery = query(
      collection(db as Firestore, "propiedadesAlquiler"),
      where("userId", "==", userId),
      orderBy("fechaCreacion", "desc")
    );

    const snapshot = await getDocs(propiedadesQuery);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      fechaCreacion: processTimestamp(doc.data().fechaCreacion),
      fechaActualizacion: processTimestamp(doc.data().fechaActualizacion),
    })) as PropiedadAlquiler[];
  },

  async obtenerPorId(id: string) {
    const { db } = getFirebaseClient();
    const docRef = doc(db as Firestore, "propiedadesAlquiler", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      fechaCreacion: processTimestamp(data.fechaCreacion),
      fechaActualizacion: processTimestamp(data.fechaActualizacion),
    } as PropiedadAlquiler;
  },
};
