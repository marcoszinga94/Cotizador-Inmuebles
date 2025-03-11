import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID,
  measurementId: import.meta.env.PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Verificar que las variables de entorno estén definidas y mostrar su estado
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
let googleProvider: GoogleAuthProvider | null = null;

// Solo inicializar Firebase en el cliente
if (typeof window !== "undefined") {
  try {
    console.log("Intentando inicializar Firebase...");

    // Verificar que todas las variables de entorno necesarias estén presentes
    if (
      !firebaseConfig.apiKey ||
      !firebaseConfig.authDomain ||
      !firebaseConfig.projectId
    ) {
      throw new Error("Faltan variables de entorno críticas para Firebase");
    }

    app = initializeApp(firebaseConfig);
    console.log("App de Firebase inicializada correctamente");

    auth = getAuth(app);
    console.log("Auth de Firebase inicializado correctamente");

    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
    console.log("GoogleAuthProvider configurado correctamente");

    // Solo inicializar analytics si estamos en el navegador y tenemos el ID de medición
    if (firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
        console.log("Analytics de Firebase inicializado correctamente");
      } catch (analyticsError) {
        console.error("Error al inicializar Analytics:", analyticsError);
        // No bloqueamos la ejecución si Analytics falla
      }
    }

    console.log("Firebase inicializado completamente con éxito");
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
    if (error instanceof Error) {
      console.error("Detalles del error:", error.message);
      console.error("Estado de la configuración de Firebase:", {
        apiKeyPresent: !!firebaseConfig.apiKey,
        authDomainPresent: !!firebaseConfig.authDomain,
        projectIdPresent: !!firebaseConfig.projectId,
        storageBucketPresent: !!firebaseConfig.storageBucket,
        messagingSenderIdPresent: !!firebaseConfig.messagingSenderId,
        appIdPresent: !!firebaseConfig.appId,
        measurementIdPresent: !!firebaseConfig.measurementId,
      });
    }
  }
}

export { app, analytics, auth, googleProvider };
