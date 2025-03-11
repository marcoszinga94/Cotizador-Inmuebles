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

// Verificar que las variables de entorno estén definidas
console.log("Environment Variables Check:", {
  hasApiKey: !!import.meta.env.PUBLIC_FIREBASE_API_KEY,
  hasAuthDomain: !!import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  hasProjectId: !!import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
});

let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let auth: Auth | null = null;
let googleProvider: GoogleAuthProvider | null = null;

// Solo inicializar Firebase en el cliente
if (typeof window !== "undefined") {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account",
    });
    analytics = getAnalytics(app);

    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Firebase config state:", {
        apiKeyPresent: !!firebaseConfig.apiKey,
        authDomainPresent: !!firebaseConfig.authDomain,
        projectIdPresent: !!firebaseConfig.projectId,
      });
    }
  }
}

export { app, analytics, auth, googleProvider };
