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
          500: '#3D6BE0',
          600: '#1D4ED8',
          700: '#1739A6',
          800: '#003399',
          900: '#001133',
        },
        surface: {
          50: '#EEF1FA',
          0: '#F7F8FD',
          100: '#E4E8F5',
          200: '#E6EEFF',
          900: '#05272E',
        },
        text: {
          DEFAULT: '#12173A',
          muted: '#575E7E',
          inverse: '#FFFFFF',
        },
        success: {
          DEFAULT: '#1F9D5C',
          500: '#1F9D5C',
          700: '#146B3E',
        },
        error: {
          DEFAULT: '#E5342A',
          500: '#E5342A',
          700: '#A8221A',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Poppins', 'system-ui', 'sans-serif'],
        body: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,23,58,0.08), 0 4px 12px rgba(18,23,58,0.06)',
        button: '0 2px 6px rgba(29,78,216,0.35)',
      },
    },
  },
  plugins: [forms],
}
