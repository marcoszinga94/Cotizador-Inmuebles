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

// Función para registrar el estado de las variables de entorno
function logEnvironmentStatus() {
  const envStatus = {
    hasApiKey: !!import.meta.env.PUBLIC_FIREBASE_API_KEY,
    hasAuthDomain: !!import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
    hasProjectId: !!import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
    hasStorageBucket: !!import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
    hasMessagingSenderId: !!import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    hasAppId: !!import.meta.env.PUBLIC_FIREBASE_APP_ID,
    hasMeasurementId: !!import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
    isProduction: import.meta.env.PROD,
  };

  console.log("Environment Status:", envStatus);
  return envStatus;
}

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

function validateConfig() {
  const envStatus = logEnvironmentStatus();
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
    const error = `Faltan las siguientes variables de entorno: ${missingKeys.join(
      ", "
    )}`;
    console.error("Error de validación:", error);
    console.error("Estado actual de la configuración:", firebaseConfig);
    throw new Error(error);
  }
}

// Solo inicializar Firebase en el cliente
if (typeof window !== "undefined") {
  try {
    console.log("Iniciando proceso de inicialización de Firebase...");
    validateConfig();

    if (!app) {
      console.log("Creando nueva instancia de Firebase...");
      app = initializeApp(firebaseConfig);

      console.log("Inicializando servicios de Firebase...");
      try {
        auth = getAuth(app);
        console.log("Auth inicializado correctamente");
      } catch (authError) {
        console.error("Error al inicializar Auth:", authError);
      }

      try {
        db = getFirestore(app);
        console.log("Firestore inicializado correctamente");
      } catch (dbError) {
        console.error("Error al inicializar Firestore:", dbError);
      }

      try {
        googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: "select_account" });
        console.log("GoogleProvider configurado correctamente");
      } catch (providerError) {
        console.error("Error al configurar GoogleProvider:", providerError);
      }

      if (firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
          console.log("Analytics inicializado correctamente");
        } catch (analyticsError) {
          console.error("Error al inicializar Analytics:", analyticsError);
        }
      }
    }
  } catch (error) {
    console.error("Error crítico al inicializar Firebase:", error);
    if (error instanceof Error) {
      console.error("Detalles del error:", {
        message: error.message,
        stack: error.stack,
      });
    }
  }
}

export { app, analytics, auth, db, googleProvider };
