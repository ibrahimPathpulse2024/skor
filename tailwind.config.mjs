/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shrinkInOut: {
          '0%, 80%': { transform: 'scale(0.6)' },
          '25%': { transform: 'scale(0.2)' },  
        },
      },
      animation: {
        shrinkInOut: 'shrinkInOut 1.5s infinite', 
      },
      fontFamily: {
        chakra: ['"Chakra Petch"', 'sans-serif'], 
        sora: ['"Sora"', 'sans-serif'],    
        satoshi: ['"Satoshi"', 'sans-serif'],         
      },
    },
  },
  plugins: [],
}