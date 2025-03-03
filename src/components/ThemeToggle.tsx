import React, { useEffect, useState } from "react";

export const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  // Inicializar el tema basado en la preferencia del usuario o localStorage
  useEffect(() => {
    // Verificar si hay una preferencia guardada en localStorage
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Si no hay preferencia guardada, usar la preferencia del sistema
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);

      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);

    if (darkMode) {
      // Cambiar a modo claro
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      // Cambiar a modo oscuro
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
      aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {darkMode ? (
        // Icono de sol para modo claro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-rosaSuave"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        // Icono de luna para modo oscuro
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-rosaSuave"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
};
