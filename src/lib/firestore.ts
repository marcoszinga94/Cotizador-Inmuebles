import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase.ts";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  lastLogin: Date;
}

export async function saveUserData(userData: UserData): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const userRef = doc(db, "users", userData.uid);
    await setDoc(
      userRef,
      {
        ...userData,
        createdAt: userData.createdAt.toISOString(),
        lastLogin: userData.lastLogin.toISOString(),
      },
      { merge: true }
    );
    console.log("Usuario guardado correctamente en Firestore");
  } catch (error) {
    console.error("Error al guardar usuario en Firestore:", error);
    throw error;
  }
}

export async function getUserData(uid: string): Promise<UserData | null> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        ...data,
        uid: userSnap.id,
        createdAt: new Date(data.createdAt),
        lastLogin: new Date(data.lastLogin),
      } as UserData;
    }

    return null;
  } catch (error) {
    console.error("Error al obtener usuario de Firestore:", error);
    throw error;
  }
}

export async function updateUserData(
  uid: string,
  data: Partial<UserData>
): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...data,
      lastLogin: data.lastLogin?.toISOString(),
    });
    console.log("Usuario actualizado correctamente en Firestore");
  } catch (error) {
    console.error("Error al actualizar usuario en Firestore:", error);
    throw error;
  }
}

export async function deleteUserData(uid: string): Promise<void> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const userRef = doc(db, "users", uid);
    await deleteDoc(userRef);
    console.log("Usuario eliminado correctamente de Firestore");
  } catch (error) {
    console.error("Error al eliminar usuario de Firestore:", error);
    throw error;
  }
}

export async function findUserByEmail(email: string): Promise<UserData | null> {
  if (!db) throw new Error("Firestore no está inicializado");

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      return {
        ...data,
        uid: doc.id,
        createdAt: new Date(data.createdAt),
        lastLogin: new Date(data.lastLogin),
      } as UserData;
    }

    return null;
  } catch (error) {
    console.error("Error al buscar usuario por email en Firestore:", error);
    throw error;
  }
}
