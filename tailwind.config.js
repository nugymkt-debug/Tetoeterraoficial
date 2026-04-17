/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta alinhada com a logo (verde musgo / navy serra)
        brand: {
          50:  '#f5f7f3',
          100: '#e6ebe0',
          200: '#cdd7c2',
          300: '#a8b995',
          400: '#86a06d',
          500: '#6a8751', // verde musgo principal
          600: '#526c3e',
          700: '#405532',
          800: '#35452b',
          900: '#2d3a25',
        },
        navy: {
          50:  '#f3f5f8',
          100: '#e3e8ef',
          200: '#c1cbd9',
          300: '#93a4ba',
          400: '#5e7793',
          500: '#425c79',
          600: '#334964',
          700: '#2a3c52',
          800: '#1f2b3c', // navy escuro principal (nav/footer)
          900: '#141d2b',
        },
        cream: '#f7f5ef',
        sand:  '#eae5d8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 32px -12px rgba(20, 29, 43, 0.18)',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
  plugins: [],
}
