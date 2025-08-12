/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brandbg: '#FAF9F6',
        brandhdr: '#0B3D2E',
        brandgold: '#C9A341',
        brandtext: '#1F2937',
        brandsub: '#6B7280',
        brandborder: '#E5E7EB',
        brandpanel: '#FFFFFF',
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
}
