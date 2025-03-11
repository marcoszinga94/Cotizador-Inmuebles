import { useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  type User,
  type Auth,
  type ErrorFn,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (!auth) {
      setError("Error de autenticación: Firebase no está inicializado");
      return;
    }

    const unsubscribe = auth.onAuthStateChanged(
      (user: User | null) => {
        setUser(user);
        setError(null);
      },
      (error) => {
        console.error("Error en auth state:", error);
        setError("Error al verificar el estado de autenticación");
      }
    );

    return () => unsubscribe();
  }, []);

  if (!mounted) return null;
  if (error) return <div className="text-white text-sm">{error}</div>;
  if (!auth || !googleProvider) return null;

  const signInWithGoogle = async () => {
    try {
      if (auth && googleProvider) {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Error al iniciar sesión con Google");
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      setError("Error al cerrar sesión");
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">Bienvenido, {user.displayName}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-primary bg-white rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 bg-white border rounded hover:bg-gray-50"
        >
          <img
            src="https://www.google.com/favicon.ico"
            alt="Google"
            className="size-4"
          />
          Iniciar sesión
        </button>
      )}
    </div>
  );
}
