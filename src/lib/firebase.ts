import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Detectar entorno
const isBrowser = typeof window !== "undefined";

type FirebaseConfigKeys = keyof typeof firebaseConfig;

// Usar variables de entorno de manera segura en ambos entornos
const getEnvVar = (key: string): string => {
  if (isBrowser) {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return import.meta.env[key] || "";
    }
    return (window as any).__ENV__?.[key] || "";
  } else {
    return process.env[key] || "";
  }
};

const firebaseConfig = {
  apiKey: getEnvVar("PUBLIC_FIREBASE_API_KEY"),
  authDomain: getEnvVar("PUBLIC_FIREBASE_AUTH_DOMAIN"),
  projectId: getEnvVar("PUBLIC_FIREBASE_PROJECT_ID"),
  storageBucket: getEnvVar("PUBLIC_FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: getEnvVar("PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
  appId: getEnvVar("PUBLIC_FIREBASE_APP_ID"),
  measurementId: getEnvVar("PUBLIC_FIREBASE_MEASUREMENT_ID"),
};

function logEnvironmentStatus() {
  return {
    hasApiKey: !!firebaseConfig.apiKey,
    hasAuthDomain: !!firebaseConfig.authDomain,
    hasProjectId: !!firebaseConfig.projectId,
    hasStorageBucket: !!firebaseConfig.storageBucket,
    hasMessagingSenderId: !!firebaseConfig.messagingSenderId,
    hasAppId: !!firebaseConfig.appId,
    hasMeasurementId: !!firebaseConfig.measurementId,
    isProduction: isBrowser
      ? typeof import.meta !== "undefined"
        ? import.meta.env?.PROD
        : true
      : process.env.NODE_ENV === "production",
    isBrowser,
  };
}

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
    const error = `Faltan las siguientes variables de entorno: ${missingKeys.join(
      ", "
    )}`;
    console.error("Error de validación:", error);
    console.error("Estado actual de la configuración:", firebaseConfig);
    throw new Error(error);
  }
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;
let analytics: any = null;

// Inicialización de Firebase
try {
  console.log("Iniciando proceso de inicialización de Firebase...");
  validateConfig();

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

  // Analytics solo en el cliente
  if (isBrowser && firebaseConfig.measurementId) {
    const initAnalytics = async () => {
      try {
        const { getAnalytics } = await import("firebase/analytics");
        analytics = getAnalytics(app as FirebaseApp);
        console.log("Analytics inicializado correctamente");
      } catch (analyticsError) {
        console.error("Error al inicializar Analytics:", analyticsError);
      }
    };

    initAnalytics();
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

// Exportación de los servicios
export { app, auth, db, googleProvider, analytics };
