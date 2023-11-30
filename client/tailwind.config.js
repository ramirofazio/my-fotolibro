/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      colors: {
        main: '#222831',
        base: '#393E46',
        primary: '#00ADB5',
        accent: '#EEEEEE'
      }
    },
  },
  plugins: [],
}

