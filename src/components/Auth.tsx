import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  type User,
  type Auth,
  type ErrorFn,
  GoogleAuthProvider,
  AuthErrorCodes,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, googleProvider } from "../lib/firebase";
import { saveUserData, updateUserData } from "../lib/firestore";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("Auth component mounted");

    // Verificar si Firebase Auth está inicializado
    if (!auth) {
      console.error("Error: Firebase Auth no está inicializado");
      setError("Error de autenticación: Firebase no está inicializado");
      return;
    }

    setIsInitialized(true);
    console.log("Firebase Auth está inicializado correctamente");

    const unsubscribe = auth.onAuthStateChanged(
      async (user: User | null) => {
        console.log(
          "Estado de autenticación cambiado:",
          user ? "Usuario autenticado" : "No autenticado"
        );
        setUser(user);

        // Actualizar última fecha de login si el usuario está autenticado
        if (user) {
          try {
            await updateUserData(user.uid, {
              lastLogin: new Date(),
            });
          } catch (error) {
            console.error("Error al actualizar última fecha de login:", error);
          }
        }

        setError(null);
      },
      (error: FirebaseError | Error) => {
        console.error("Error en auth state:", error);
        if (error instanceof FirebaseError) {
          console.error("Código de error:", error.code);
          console.error("Mensaje de error:", error.message);
        }
        setError("Error al verificar el estado de autenticación");
      }
    );

    return () => {
      console.log("Limpiando suscripción de Auth");
      unsubscribe();
    };
  }, []);

  if (!mounted) {
    console.log("Componente no montado aún");
    return null;
  }

  if (error) {
    console.log("Mostrando error:", error);
    return (
      <div className="text-white text-sm bg-red-500 p-2 rounded">{error}</div>
    );
  }

  if (!isInitialized || !auth || !googleProvider) {
    console.log("Firebase no está completamente inicializado");
    return (
      <div className="text-white text-sm bg-yellow-500 p-2 rounded">
        Inicializando autenticación...
      </div>
    );
  }

  const signInWithGoogle = async () => {
    try {
      console.log("Iniciando proceso de login con Google");
      setIsLoading(true);

      if (auth && googleProvider) {
        console.log("Llamando a signInWithPopup");
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Login exitoso:", result.user.displayName);

        await saveUserData({
          uid: result.user.uid,
          email: result.user.email || "",
          displayName: result.user.displayName || "",
          photoURL: result.user.photoURL || undefined,
          createdAt: new Date(),
          lastLogin: new Date(),
        });
      } else {
        throw new Error("Auth o GoogleProvider no están disponibles");
      }
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);

      // Manejar errores específicos
      if (error instanceof FirebaseError) {
        console.error("Código de error:", error.code);

        switch (error.code) {
          case AuthErrorCodes.POPUP_BLOCKED:
            setError(
              "El navegador bloqueó la ventana emergente. Por favor, permita ventanas emergentes para este sitio."
            );
            break;
          case AuthErrorCodes.POPUP_CLOSED_BY_USER:
            setError(
              "Ventana de inicio de sesión cerrada antes de completar la autenticación."
            );
            break;
          case "auth/network-request-failed":
            setError("Error de red. Verifique su conexión a Internet.");
            break;
          case "auth/unauthorized-domain":
            setError(
              "Este dominio no está autorizado para operaciones de OAuth. Verifique la configuración de Firebase."
            );
            break;
          default:
            setError(`Error al iniciar sesión con Google: ${error.message}`);
        }
      } else {
        setError("Error desconocido al iniciar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log("Iniciando proceso de cierre de sesión");
      setIsLoading(true);

      if (auth) {
        await signOut(auth);
        console.log("Cierre de sesión exitoso");
      } else {
        throw new Error("Auth no está disponible");
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError("Error al cerrar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.displayName}</span>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="px-4 py-2 text-sm text-primary bg-white rounded disabled:opacity-50"
          >
            {isLoading ? "Procesando..." : "Cerrar Sesión"}
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="size-4"
          />
          {isLoading ? "Procesando..." : "Iniciar sesión"}
        </button>
      )}
    </div>
  );
}
