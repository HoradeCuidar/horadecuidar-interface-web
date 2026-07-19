import forms from '@tailwindcss/forms'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#E8F9FC',
          100: '#E6EEFF',
          200: '#CCDDFF',
          300: '#99BBFF',
          400: '#6C9DFF',
          500: '#6699FF', 
          600: '#3377FF',
          700: '#0044CC',
          800: '#003399',
          900: '#001133',
        },
        surface: {
          50: '#FFFFFF',
          100: '#ECECEC',
          200: '#E6EEFF',
          900: '#05272E',
        },
        text: {
          DEFAULT: '#333333',
          muted: '#667A8A',
          inverse: '#FFFFFF',
        },

        success: '#2EAD6D',
        error: '#E5533D',
      },
    
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        heading: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [forms],
}

