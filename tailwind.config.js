/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Asegúrate de que está apuntando a los archivos correctos
  ],
  theme: {
    extend: {
      screens: {
        'xl-small': '1100px', // Media query personalizada para 1100px
      },
    },
  },
  plugins: [],
};
