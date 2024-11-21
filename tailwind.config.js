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
        dastress: ['"Dastress"', 'sans-serif'],
      },
      screens: { // tamaños de pantalla personalizados
        'xs': '360px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      keyframes: {
        pulse2: {
          '50%': {
            opacity: '.8',
          },
        },
      },
      animation: {
        pulse2: 'pulse2 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      textShadow: {
        redGlow: '0 0 10px #da4646, 0 0 20px #da4646, 0 0 30px #da4646, 0 0 40px #da4646, 0 0 50px #da4646, 0 0 60px #da4646, 0 0 70px #da4646',
      },
    },
  },
  plugins: [
    require('tailwindcss-textshadow'),
  ],
};
