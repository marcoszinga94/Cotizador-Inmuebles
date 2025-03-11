import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

type FirebaseConfigKeys = keyof typeof firebaseConfig;

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

console.log("Environment Variables Check:", {
  hasApiKey: !!import.meta.env.PUBLIC_FIREBASE_API_KEY,
  hasAuthDomain: !!import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  hasProjectId: !!import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  hasStorageBucket: !!import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  hasMessagingSenderId: !!import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  hasAppId: !!import.meta.env.PUBLIC_FIREBASE_APP_ID,
  hasMeasurementId: !!import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
});

// Verificar si estamos en producción o desarrollo
const isProduction = import.meta.env.PROD;
console.log(`Entorno: ${isProduction ? "Producción" : "Desarrollo"}`);

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

function validateConfig() {
  const requiredKeys: FirebaseConfigKeys[] = [
    "apiKey",
    "authDomain",
    "projectId",
    "storageBucket",
    "messagingSenderId",
    "appId",
  ];
  const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);

  if (missingKeys.length > 0) {
    throw new Error(
      `Faltan las siguientes variables de entorno: ${missingKeys.join(", ")}`
    );
  }
}

// Solo inicializar Firebase en el cliente
if (typeof window !== "undefined") {
  try {
    validateConfig();

    // Prevenir múltiples inicializaciones
    if (!app) {
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      db = getFirestore(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({
        prompt: "select_account",
      });

      // Solo inicializar analytics si estamos en el navegador y tenemos el ID de medición
      if (firebaseConfig.measurementId && typeof window !== "undefined") {
        analytics = getAnalytics(app);
      }
    }
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
    // No lanzar el error, solo registrarlo
    // Esto evita que la aplicación se rompa si hay un problema con Firebase
  }
}

export { app, analytics, auth, db, googleProvider };
