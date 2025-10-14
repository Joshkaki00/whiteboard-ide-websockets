/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./public/**/*.{html,js}",
    "./public/*.{html,js}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
      colors: {
        'interview': {
          'primary': '#667eea',
          'secondary': '#764ba2',
          'success': '#48bb78',
          'danger': '#f56565',
          'warning': '#ed8936',
        }
      }
    },
  },
  plugins: [],
}
