/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#db2777',     //rosado
        secondary: '#ffffff',   //blanco
        grisClaro: '#d1d5db',   //gris claro
        grisOscuro: '#1f2937',  //gris oscuro
        rosaClaro: '#fce7f3',   //rosa suave
        rosaOscuro: '#be185d',  //rosa oscura
        negro: '#000000',       //negro
        verdeDolar: '#278664',  //verde
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 