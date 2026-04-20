import colors from 'tailwindcss/colors';

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',
      slate: colors.slate,
      gray: colors.gray,
      zinc: colors.zinc,
      neutral: colors.neutral,
      stone: colors.stone,
      red: colors.red,
      orange: colors.orange,
      amber: colors.amber,
      yellow: colors.yellow,
      lime: colors.lime,
      green: colors.green,
      emerald: colors.emerald,
      teal: colors.teal,
      cyan: colors.cyan,
      sky: colors.sky,
      blue: colors.blue,
      indigo: colors.indigo,
      violet: colors.violet,
      purple: colors.purple,
      fuchsia: colors.fuchsia,
      pink: colors.pink,
      rose: colors.rose,
      primary: colors.blue[700],
      accent: colors.sky[600],
      muted: colors.slate[600],
      surface: '#ffffff',
      surface2: '#f8fafc',
      border: 'rgba(15, 23, 42, 0.08)'
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'bodoni': ['Bodoni Moda', 'serif']
      }
    }
  },
  plugins: []
};
