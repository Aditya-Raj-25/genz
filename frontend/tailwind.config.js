/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00FF94",
        secondary: "#FF00E5",
        accent: "#7000FF",
        background: "#050505",
        surface: "#121212",
        "surface-light": "#1E1E1E",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 255, 148, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 255, 148, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
