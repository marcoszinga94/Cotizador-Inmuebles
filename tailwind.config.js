/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#db2777',   //rosado
        secondary: '#ffffff', //blanco
        grisSuave: '#d1d5db',//gris claro
        grisOscuro: '#1f2937',//gris oscuro
        rosaSuave: '#fce7f3', //rosa suave
        rosaOscuro: '#be185d', //rosa oscura
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
} 