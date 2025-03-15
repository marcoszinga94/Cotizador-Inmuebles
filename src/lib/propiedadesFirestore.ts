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
  type DocumentData,
} from "firebase/firestore";
import { db, auth } from "./firebase.ts";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.ts";

// Función segura para obtener el ID del usuario actual
const getCurrentUserId = () => {
  if (!auth?.currentUser) {
    throw new Error("No hay usuario autenticado");
  }
  return auth.currentUser.uid;
};

// Función para manejar datos de Timestamp de Firestore
const processTimestamp = (timestamp: any): string | null => {
  if (!timestamp) return null;
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate().toISOString();
  }
  return timestamp;
};

// Función para procesar los datos de una propiedad desde Firestore
const processPropiedadData = (
  id: string,
  data: DocumentData
): PropiedadAlquiler => {
  return {
    id,
    propietario: data.propietario,
    contactoPropietario: data.contactoPropietario,
    inquilino: data.inquilino,
    contactoInquilino: data.contactoInquilino,
    fechaInicioContrato: data.fechaInicioContrato,
    duracionContrato: data.duracionContrato,
    precioAlquiler: data.precioAlquiler,
    intervaloAumento: data.intervaloAumento,
    direccion: data.direccion,
    descripcion: data.descripcion,
    montoAlquiler: data.montoAlquiler,
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,
    estado: data.estado,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    fechaCreacion:
      data.fechaCreacion instanceof Timestamp
        ? data.fechaCreacion.toDate().toISOString()
        : data.fechaCreacion,
    fechaActualizacion:
      data.fechaActualizacion instanceof Timestamp
        ? data.fechaActualizacion.toDate().toISOString()
        : data.fechaActualizacion,
  };
};

// Verificar disponibilidad de Firestore
const checkFirestore = () => {
  if (!db) throw new Error("Firestore no está inicializado");
};

export async function agregarPropiedadAlquiler(
  propiedad: PropiedadAlquiler
): Promise<string> {
  checkFirestore();

  try {
    const userId = getCurrentUserId();

    const propiedadData = {
      ...propiedad,
      userId,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db!, "propiedadesAlquiler"),
      propiedadData
    );
    console.log("Propiedad de alquiler agregada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar propiedad de alquiler:", error);
    throw error;
  }
}

export async function obtenerPropiedadesAlquiler(): Promise<
  PropiedadAlquiler[]
> {
  checkFirestore();

  try {
    const userId = getCurrentUserId();
    const propiedadesQuery = query(
      collection(db!, "propiedadesAlquiler"),
      where("userId", "==", userId),
      orderBy("fechaCreacion", "desc")
    );

    const querySnapshot = await getDocs(propiedadesQuery);
    const propiedades: PropiedadAlquiler[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      propiedades.push(processPropiedadData(doc.id, data));
    });

    return propiedades;
  } catch (error) {
    console.error("Error al obtener propiedades de alquiler:", error);
    throw error;
  }
}

export async function obtenerPropiedadAlquilerPorId(
  propiedadId: string
): Promise<PropiedadAlquiler | null> {
  checkFirestore();

  try {
    const docRef = doc(db!, "propiedadesAlquiler", propiedadId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return processPropiedadData(docSnap.id, data);
    } else {
      console.error(
        "No se encontró la propiedad de alquiler con ID:",
        propiedadId
      );
      return null;
    }
  } catch (error) {
    console.error("Error al obtener propiedad de alquiler:", error);
    throw error;
  }
}

export async function actualizarPropiedadAlquiler(
  propiedadId: string,
  propiedad: Partial<PropiedadAlquiler>
): Promise<void> {
  checkFirestore();

  try {
    const docRef = doc(db!, "propiedadesAlquiler", propiedadId);

    // Verificar que la propiedad pertenece al usuario actual
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("La propiedad no existe");
    }

    const data = docSnap.data();
    if (data.userId !== getCurrentUserId()) {
      throw new Error("No tienes permiso para editar esta propiedad");
    }

    await updateDoc(docRef, {
      ...propiedad,
      fechaActualizacion: serverTimestamp(),
    });

    console.log("Propiedad de alquiler actualizada correctamente");
  } catch (error) {
    console.error("Error al actualizar propiedad de alquiler:", error);
    throw error;
  }
}

export async function eliminarPropiedadAlquiler(
  propiedadId: string
): Promise<void> {
  checkFirestore();

  try {
    const docRef = doc(db!, "propiedadesAlquiler", propiedadId);

    // Verificar que la propiedad pertenece al usuario actual
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      throw new Error("La propiedad no existe");
    }

    const data = docSnap.data();
    if (data.userId !== getCurrentUserId()) {
      throw new Error("No tienes permiso para eliminar esta propiedad");
    }

    await deleteDoc(docRef);
    console.log("Propiedad de alquiler eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar propiedad de alquiler:", error);
    throw error;
  }
}
