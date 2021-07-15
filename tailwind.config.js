module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './src/Components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      cursor: ['hover'],
    },
  },
  plugins: [],
  important: true,
};
