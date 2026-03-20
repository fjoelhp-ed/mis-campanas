/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Habilita el modo oscuro manual que construimos
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'), // Opcional, pero recomendado para el editor de estrategias
  ],
}