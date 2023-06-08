/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        "2xs": ['.65rem', '.75rem'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar', {nocompatible: true }),
  ],
  variants: {},
  corePlugins: {
    preflight: true,
  },
};
