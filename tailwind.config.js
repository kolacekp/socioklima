/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
    './node_modules/@tremor/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite/**/*.js',
    './node_modules/flowbite-react/**/*.js'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('flowbite/plugin')]
};
