import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          50: 'rgb(254, 242, 242)',
          100: 'rgb(254, 226, 226)',
          200: 'rgb(252, 165, 165)',
          300: 'rgb(248, 113, 113)',
          400: 'rgb(239, 68, 68)',
          500: 'rgb(220, 38, 38)',
          600: 'rgb(185, 28, 28)',
          700: 'rgb(153, 27, 27)',
          800: 'rgb(127, 29, 29)',
          900: 'rgb(102, 26, 26)',
          950: 'rgb(69, 10, 10)',
        },
        // Secondary Colors
        secondary: {
          50: 'rgb(248, 250, 252)',
          100: 'rgb(241, 245, 249)',
          200: 'rgb(226, 232, 240)',
          300: 'rgb(203, 213, 225)',
          400: 'rgb(148, 163, 184)',
          500: 'rgb(100, 116, 139)',
          600: 'rgb(71, 85, 105)',
          700: 'rgb(51, 65, 85)',
          800: 'rgb(30, 41, 59)',
          900: 'rgb(15, 23, 42)',
          950: 'rgb(2, 6, 23)',
        },
        // Accent Colors
        accent: {
          50: 'rgb(254, 249, 195)',
          100: 'rgb(254, 240, 138)',
          200: 'rgb(253, 224, 71)',
          300: 'rgb(250, 204, 21)',
          400: 'rgb(234, 179, 8)',
          500: 'rgb(202, 138, 4)',
          600: 'rgb(161, 98, 7)',
          700: 'rgb(133, 77, 14)',
          800: 'rgb(113, 63, 18)',
          900: 'rgb(92, 51, 15)',
          950: 'rgb(66, 32, 6)',
        },
        // Status Colors
        success: {
          50: 'rgb(240, 253, 244)',
          100: 'rgb(220, 252, 231)',
          200: 'rgb(187, 247, 208)',
          300: 'rgb(134, 239, 172)',
          400: 'rgb(74, 222, 128)',
          500: 'rgb(34, 197, 94)',
          600: 'rgb(22, 163, 74)',
          700: 'rgb(21, 128, 61)',
          800: 'rgb(22, 101, 52)',
          900: 'rgb(20, 83, 45)',
          950: 'rgb(5, 46, 22)',
        },
        warning: {
          50: 'rgb(255, 251, 235)',
          100: 'rgb(254, 243, 199)',
          200: 'rgb(253, 230, 138)',
          300: 'rgb(252, 211, 77)',
          400: 'rgb(251, 191, 36)',
          500: 'rgb(245, 158, 11)',
          600: 'rgb(217, 119, 6)',
          700: 'rgb(180, 83, 9)',
          800: 'rgb(146, 64, 14)',
          900: 'rgb(120, 53, 15)',
          950: 'rgb(69, 26, 3)',
        },
        error: {
          50: 'rgb(254, 242, 242)',
          100: 'rgb(254, 226, 226)',
          200: 'rgb(252, 165, 165)',
          300: 'rgb(248, 113, 113)',
          400: 'rgb(239, 68, 68)',
          500: 'rgb(220, 38, 38)',
          600: 'rgb(185, 28, 28)',
          700: 'rgb(153, 27, 27)',
          800: 'rgb(127, 29, 29)',
          900: 'rgb(102, 26, 26)',
          950: 'rgb(69, 10, 10)',
        },
        info: {
          50: 'rgb(239, 246, 255)',
          100: 'rgb(219, 234, 254)',
          200: 'rgb(191, 219, 254)',
          300: 'rgb(147, 197, 253)',
          400: 'rgb(96, 165, 250)',
          500: 'rgb(59, 130, 246)',
          600: 'rgb(37, 99, 235)',
          700: 'rgb(29, 78, 216)',
          800: 'rgb(30, 64, 175)',
          900: 'rgb(30, 58, 138)',
          950: 'rgb(23, 37, 84)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.2), 0 2px 10px 0px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(220, 38, 38, 0.3)',
        'glow-lg': '0 0 40px rgba(220, 38, 38, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, rgb(220, 38, 38), rgb(185, 28, 28))',
        'gradient-secondary': 'linear-gradient(135deg, rgb(100, 116, 139), rgb(71, 85, 105))',
        'gradient-accent': 'linear-gradient(135deg, rgb(202, 138, 4), rgb(161, 98, 7))',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

export default config
