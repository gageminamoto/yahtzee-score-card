/** @type {import('tailwindcss').Config} */
export default {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
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
      zIndex: {
        // Fixed z-index scale - use these instead of arbitrary values
        'base': '0',
        'dropdown': '10',
        'sticky': '20',
        'overlay': '30',
        'modal': '40',
        'popover': '50',
      },
    },
  },
  plugins: [],
}

