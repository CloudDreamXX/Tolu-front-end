/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'var(--primary)',
        textColor: 'var(--text-color)'
      },
      backgroundImage:{
        gradientText: "linear-gradient(90deg, #008FF6 0%, #926DFB 53.5%, #E34ECB 81.5%, #F44F16 100%)",
      }
    },
  },
  plugins: [],
}