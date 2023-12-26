/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
      "./widgets/**/*.{tsx,ts,jsx,js}",
      "./app/**/*.{tsx,ts,jsx,js}",
      "./ui/**/*.{tsx,ts,jsx,js}",
      "./components/**/*.{tsx,ts,jsx,js}",
      "./features/**/*.{tsx,ts,jsx,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

