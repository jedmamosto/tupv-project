/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // PRIMARY
        primary: {
          DEFAULT: '#3d5300',
          50: '#9ea980',
          100: '#8b9866',
          200: '#77874d',
          300: '#647533',
          400: '#50641a',
          500: '#3d5300', // same as DEFAULT
          600: '#374b00',
          700: '#314200',
          800: '#2b3a00',
          900: '#253200',
        },
        // SECONDARY
        secondary: {
          DEFAULT: '#abba7c',
          50: '#d5ddbe',
          100: '#cdd6b0',
          200: '#c4cfa3',
          300: '#bcc896',
          400: '#b3c189',
          500: '#abba7c', // same as DEFAULT
          600: '#9aa770',
          700: '#899563',
          800: '#788257',
          900: '#67704a',
        },
        // ACCENTS
        accent: {
          orange: '#f09319',
          yellow: '#ffe31a',
        },
        // SEMANTICS
        success: '#215300',
        warning: '#ffaa71',
        danger: '#ff4545',
        // SHADES
        light: '#ffffff',
        dark: '#0c1100',
      }
    },
  },
  plugins: [],
};
