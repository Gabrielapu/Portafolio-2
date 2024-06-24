/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        company: {
          primary: '#E22319',
          'primary-variant': '#CC261D',
          secondary: '#3A7BC8',
          'secondary-variant': '#356BAB',
          alternative: '#FFB24B',
          'alternative-variant': '#FFB24B',
        }
      }
    },
  },
  plugins: [],
}

