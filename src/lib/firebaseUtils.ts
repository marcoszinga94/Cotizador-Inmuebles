import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase.ts";
import { signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import type { PropiedadAlquiler } from "../types/propiedadesTypes.ts";

// Función para obtener el ID del usuario actual
const getCurrentUserId = () => {
  if (!auth?.currentUser) {
    throw new Error("No hay usuario autenticado");
  }
  return auth.currentUser.uid;
};

// Función para verificar si hay un usuario autenticado
export const isUserAuthenticated = () => {
  return !!auth?.currentUser;
};

// Función para cerrar sesión
export const signOutUser = async (): Promise<void> => {
  if (!auth) {
    throw new Error("Auth no está inicializado");
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    throw error;
  }
};

// Función para observar cambios en el estado de autenticación
export const onAuthStateChange = (
  callback: (isAuthenticated: boolean) => void
) => {
  if (!auth) {
    console.error("Auth no está inicializado");
    return () => {};
  }

  // Verificar el estado actual antes de suscribirse
  const currentUser = auth.currentUser;
  if (currentUser) {
    // Si ya hay un usuario, notificamos inmediatamente
    callback(true);
  }

  // Usar la instancia existente de auth y solo notificar cambios reales
  const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
    const isAuthenticated = !!user;
    callback(isAuthenticated);
  });

  // Retornar función de limpieza
  return () => {
    try {
      unsubscribe();
    } catch (error) {
      console.error("Error al desuscribirse:", error);
    }
  };
};

// Add a new document with a generated ID
export async function addData() {
  try {
    const docRef = await addDoc(collection(db!, "users"), {
      name: "John Doe",
      age: 30,
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
}

// Retrieve all documents from the "users" collection
export async function getAllData() {
  try {
    const querySnapshot = await getDocs(collection(db!, "users"));
    const users: any[] = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data(),
      });
      console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });
    return users;
  } catch (e) {
    console.error("Error getting documents: ", e);
    throw e;
  }
}

// Retrieve a single document by ID
export async function getSingleDocument(documentId: string) {
  try {
    const docRef = doc(db!, "users", documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      return {
        id: docSnap.id,
        ...docSnap.data(),
      };
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (e) {
    console.error("Error getting document: ", e);
    throw e;
  }
}

// Agregar una nueva tasación para el usuario actual
export async function addTasacion(tasacionData: any) {
  try {
    const userId = getCurrentUserId();
    const docRef = await addDoc(collection(db!, "tasaciones"), {
      ...tasacionData,
      userId,
      createdAt: new Date().toISOString(),
    });
    console.log("Tasación guardada con ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error al guardar la tasación: ", e);
    throw e;
  }
}

// Obtener todas las tasaciones del usuario actual
export async function getUserTasaciones() {
  try {
    const userId = getCurrentUserId();
    const tasacionesRef = collection(db!, "tasaciones");
    const q = query(tasacionesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const tasaciones: any[] = [];
    querySnapshot.forEach((doc) => {
      tasaciones.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    return tasaciones;
  } catch (e) {
    console.error("Error al obtener las tasaciones: ", e);
    throw e;
  }
}

// Obtener una tasación específica del usuario
export async function getTasacionById(tasacionId: string) {
  try {
    const userId = getCurrentUserId();
    const docRef = doc(db!, "tasaciones", tasacionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      // Verificar que la tasación pertenezca al usuario actual
      if (data.userId === userId) {
        return {
          id: docSnap.id,
          ...data,
        };
      } else {
        throw new Error("No tienes permiso para ver esta tasación");
      }
    } else {
      return null;
    }
  } catch (e) {
    console.error("Error al obtener la tasación: ", e);
    throw e;
  }
}

const COLECCION_PROPIEDADES = "propiedades";

export const agregarPropiedad = async (
  propiedad: PropiedadAlquiler
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db!, COLECCION_PROPIEDADES),
      propiedad
    );
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar propiedad:", error);
    throw error;
  }
};

export const actualizarPropiedad = async (
  propiedadId: string,
  propiedad: Partial<PropiedadAlquiler>
): Promise<boolean> => {
  try {
    const docRef = doc(db!, COLECCION_PROPIEDADES, propiedadId);
    await updateDoc(docRef, propiedad);
    return true;
  } catch (error) {
    console.error("Error al actualizar propiedad:", error);
    return false;
  }
};

export const eliminarPropiedad = async (
  propiedadId: string
): Promise<boolean> => {
  try {
    const docRef = doc(db!, COLECCION_PROPIEDADES, propiedadId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error("Error al eliminar propiedad:", error);
    return false;
  }
};

export const obtenerPropiedades = async (): Promise<PropiedadAlquiler[]> => {
  try {
    const querySnapshot = await getDocs(collection(db!, COLECCION_PROPIEDADES));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as PropiedadAlquiler)
    );
  } catch (error) {
    console.error("Error al obtener propiedades:", error);
    return [];
  }
};
