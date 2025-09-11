// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--border)',
        ring: 'var(--ring)',
      },
    },
  },
  plugins: [],
}

