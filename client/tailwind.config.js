/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        vt323: ['"VT323"', 'monospace'],
        sans: ['"VT323"', 'monospace'], // Default to readable retro font
      },
      colors: {
        // Pixel Art Retro Palette
        retro: {
          bg: '#1e1e2e',
          wood: '#8b5a2b',
          woodDark: '#5c3a21',
          woodLight: '#c29255',
          panel: '#3b82f6',
          panelDark: '#1e3a8a',
          panelBorder: '#172554',
          gold: '#f59e0b',
          text: '#f8fafc',
          textDim: '#cbd5e1',
          success: '#4ade80',
          danger: '#ef4444',
          warning: '#eab308'
        }
      },
      boxShadow: {
        // Pixelated button and panel borders (hard shadows)
        'pixel': 'inset -4px -4px 0px 0px rgba(0,0,0,0.5)',
        'pixel-pressed': 'inset 4px 4px 0px 0px rgba(0,0,0,0.5)',
        'pixel-wood': 'inset -4px -4px 0px 0px #5c3a21, inset 4px 4px 0px 0px #c29255',
        'pixel-wood-pressed': 'inset 4px 4px 0px 0px #5c3a21, inset -4px -4px 0px 0px #c29255',
        'pixel-panel': 'inset -4px -4px 0px 0px #1e3a8a, inset 4px 4px 0px 0px #60a5fa, 0 0 0 4px #172554',
      }
    },
  },
  plugins: [],
}
