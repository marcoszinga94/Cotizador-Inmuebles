import { useEffect, useState } from "react";
import { signInWithPopup, signOut, type User } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

export default function Auth() {
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!auth) return;

    const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  if (!mounted || !auth || !googleProvider) return null;

  const signInWithGoogle = async () => {
    try {
      if (auth && googleProvider) {
        await signInWithPopup(auth, googleProvider);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm">Bienvenido, {user.email}</span>
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600"
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
            className="w-4 h-4"
          />
          Iniciar sesión con Google
        </button>
      )}
    </div>
  );
}
