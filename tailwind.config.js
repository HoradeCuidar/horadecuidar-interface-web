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
          'Poppins',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [forms],
}

