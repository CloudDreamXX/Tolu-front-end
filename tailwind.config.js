/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        textColor: 'var(--text-color)',
        btnBg: '#008FF610',
        accent: '#008FF6',
        stroke: '#DBDEE1',
        contentBg: '#DBDEE1',
      },
      backgroundImage: {
        gradientText: "linear-gradient(90deg, #008FF6 0%, #926DFB 53.5%, #E34ECB 81.5%, #F44F16 100%)",
      },
      screens: {
        'xs': '320px', // Custom 'xs' breakpoint for extra small screens
        'sm': '640px', // Default small screens
        'md': '768px', // Medium screens (tablets, smaller laptops)
        'lg': '1024px', // Large screens (desktops)
        'xl': '1280px', // Extra-large screens (larger desktops)
        '2xl': '1536px', // 2x extra-large screens (very large desktops or TVs)
      },
      fontSize: {
        'h1': ['32px', { lineHeight: '1.25', fontWeight: '700' }],
        'h2': ['28px', { lineHeight: '1.25', fontWeight: '700' }],
        'h3': ['24px', { lineHeight: '1.25', fontWeight: '700' }],
        'h4': ['20px', { lineHeight: '1.25', fontWeight: '700' }],
        'h5': ['16px', { lineHeight: '1.25', fontWeight: '700' }],
        'p': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
        'p-md': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
      },
    },
  },
  plugins: [],
}