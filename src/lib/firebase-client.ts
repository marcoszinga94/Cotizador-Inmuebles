import { initializeApp, type FirebaseApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider } from "firebase/auth";
import { Firestore, getFirestore } from "firebase/firestore";

// Config usando variables de entorno de cliente
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Inicialización diferida - solo ejecutar en cliente
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: any = null;

// Función para obtener instancias inicializadas
export function getFirebaseClient() {
  if (typeof window === "undefined") {
    throw new Error("Firebase client solo puede usarse en el navegador");
  }

  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: "select_account" });

    if (firebaseConfig.measurementId) {
      import("firebase/analytics").then(({ getAnalytics }) => {
        analytics = getAnalytics(app as FirebaseApp);
      });
    }
  }

  return { app, auth, db, googleProvider, analytics };
}
