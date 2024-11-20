/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#646cff',
        secondary: '#535bf2',
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
        epilogue: ['Epilogue', 'sans-serif'],
        russo: ['"Russo One"', 'sans-serif'],
      },
      screens: { // tamaños de pantalla personalizados
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },

    },
  },
  plugins: [],
};
