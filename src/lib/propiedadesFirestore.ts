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
} from "firebase/firestore";
import { db, auth } from "./firebase.js";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.js";

// Función para obtener el ID del usuario actual
const getCurrentUserId = () => {
  if (!auth?.currentUser) {
    throw new Error("No hay usuario autenticado");
  }
  return auth.currentUser.uid;
};

/**
 * Agrega una nueva propiedad de alquiler a Firestore
 */
export async function agregarPropiedadAlquiler(
  propiedad: PropiedadAlquiler
): Promise<string> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const userId = getCurrentUserId();

    const propiedadData = {
      ...propiedad,
      userId,
      fechaCreacion: serverTimestamp(),
      fechaActualizacion: serverTimestamp(),
    };

    const docRef = await addDoc(
      collection(db, "propiedadesAlquiler"),
      propiedadData
    );
    console.log("Propiedad de alquiler agregada con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar propiedad de alquiler:", error);
    throw error;
  }
}

/**
 * Obtiene todas las propiedades de alquiler del usuario actual
 */
export async function obtenerPropiedadesAlquiler(): Promise<
  PropiedadAlquiler[]
> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const userId = getCurrentUserId();
    const propiedadesQuery = query(
      collection(db, "propiedadesAlquiler"),
      where("userId", "==", userId),
      orderBy("fechaCreacion", "desc")
    );

    const querySnapshot = await getDocs(propiedadesQuery);
    const propiedades: PropiedadAlquiler[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      propiedades.push({
        id: doc.id,
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
        fechaCreacion:
          data.fechaCreacion instanceof Timestamp
            ? data.fechaCreacion.toDate().toISOString()
            : data.fechaCreacion,
        fechaActualizacion:
          data.fechaActualizacion instanceof Timestamp
            ? data.fechaActualizacion.toDate().toISOString()
            : data.fechaActualizacion,
      });
    });

    return propiedades;
  } catch (error) {
    console.error("Error al obtener propiedades de alquiler:", error);
    throw error;
  }
}

/**
 * Obtiene una propiedad de alquiler por su ID
 */
export async function obtenerPropiedadAlquilerPorId(
  propiedadId: string
): Promise<PropiedadAlquiler | null> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const docRef = doc(db, "propiedadesAlquiler", propiedadId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
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
        fechaCreacion:
          data.fechaCreacion instanceof Timestamp
            ? data.fechaCreacion.toDate().toISOString()
            : data.fechaCreacion,
        fechaActualizacion:
          data.fechaActualizacion instanceof Timestamp
            ? data.fechaActualizacion.toDate().toISOString()
            : data.fechaActualizacion,
      };
    } else {
      console.log(
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

/**
 * Actualiza una propiedad de alquiler existente
 */
export async function actualizarPropiedadAlquiler(
  propiedadId: string,
  propiedad: Partial<PropiedadAlquiler>
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const docRef = doc(db, "propiedadesAlquiler", propiedadId);

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

/**
 * Elimina una propiedad de alquiler
 */
export async function eliminarPropiedadAlquiler(
  propiedadId: string
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const docRef = doc(db, "propiedadesAlquiler", propiedadId);

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
