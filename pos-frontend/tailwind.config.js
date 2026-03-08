/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'jp-red': '#B91C1C',    // สีแดงชาด (crimson-700)
        'jp-indigo': '#1E293B', // สีน้ำเงินครามเข้ม (slate-800)
        'jp-charcoal': '#111827', // สีเทาถ่าน (gray-900)
        'jp-bg': '#F9FAFB',     // สีขาวนวล (gray-50)
      },
    },
  },
  plugins: [],
}