/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
      'tv': '2560px',
    },
    extend: {
      colors: {
        luxury: {
          bg: "#131312",
          base: "#0e0e0d",
          surface: "#1c1c1a",
          elevated: "#20201e",
          highest: "#2a2a29",
          border: "rgba(244, 244, 241, 0.08)",
          borderBright: "rgba(244, 244, 241, 0.2)",
          ivory: "#f4f4f1",
          muted: "#a8a89f",
          dim: "#636563",
          accentCyan: "#38bdf8",
          accentEmerald: "#34d399",
          accentAmber: "#fbbf24",
          accentRose: "#fb7185",
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}
