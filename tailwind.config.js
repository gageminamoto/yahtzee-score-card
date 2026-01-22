/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // CMYK-inspired bold color palette
        'electric-blue': '#0066FF',
        'hot-magenta': '#FF0099',
        'bright-yellow': '#FFDD00',
        'vivid-orange': '#FF6600',
        'deep-purple': '#6600CC',
        'bright-green': '#00FF66',
        'bright-red': '#FF0033',
      },
      fontFamily: {
        'serif': ['Instrument Serif', 'serif'],
        'sans': ['Albert Sans', 'sans-serif'],
      },
      fontSize: {
        // Typography scale for bold hierarchy
        'display': ['120px', { lineHeight: '1', fontWeight: '700' }],
        'headline': ['96px', { lineHeight: '1.1', fontWeight: '700' }],
        'title': ['64px', { lineHeight: '1.1', fontWeight: '600' }],
        'subtitle': ['48px', { lineHeight: '1.2', fontWeight: '600' }],
        'body-lg': ['24px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'ui': ['14px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      borderWidth: {
        '6': '6px',
        '8': '8px',
      },
    },
  },
  plugins: [],
}

