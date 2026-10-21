/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        soft: '0 20px 50px rgba(30, 64, 175, 0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        bubble: {
          '0%': { transform: 'translateY(0) scale(0.6)', opacity: '0' },
          '20%': { opacity: '0.9' },
          '100%': { transform: 'translateY(-60px) scale(1.1)', opacity: '0' },
        },
        steam: {
          '0%': { transform: 'translateY(0) scaleY(0.8)', opacity: '0' },
          '40%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-22px) scaleY(1.2)', opacity: '0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-6deg)' },
          '50%': { transform: 'rotate(6deg)' },
        },
        shine: {
          '0%': { transform: 'translateX(-120%) skewX(-20deg)' },
          '100%': { transform: 'translateX(220%) skewX(-20deg)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        // transform-only so the blurred shape is moved by the GPU instead of being repainted every frame
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg) scale(1)' },
          '33%': { transform: 'translate(20px, -24px) rotate(40deg) scale(1.08)' },
          '66%': { transform: 'translate(-18px, 16px) rotate(-30deg) scale(0.94)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        wave: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        draw: {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        drive: {
          '0%, 100%': { transform: 'translateX(-6px) translateY(0)' },
          '25%': { transform: 'translateX(0) translateY(-2px)' },
          '50%': { transform: 'translateX(6px) translateY(0)' },
          '75%': { transform: 'translateX(0) translateY(-1px)' },
        },
        swing: {
          '0%, 100%': { transform: 'rotate(-12deg)' },
          '50%': { transform: 'rotate(12deg)' },
        },
        rotor: {
          '0%, 100%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(0.12)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '70%': { transform: 'scale(1.08)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        bubble: 'bubble 2.6s ease-in infinite',
        steam: 'steam 2s ease-out infinite',
        wiggle: 'wiggle 1.2s ease-in-out infinite',
        'spin-slow': 'spin 6s linear infinite',
        shine: 'shine 2.8s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
        marquee: 'marquee 28s linear infinite',
        blob: 'blob 14s ease-in-out infinite',
        'gradient-x': 'gradient-x 5s ease infinite',
        wave: 'wave 3s linear infinite',
        draw: 'draw 0.6s ease-out forwards',
        drive: 'drive 1.6s ease-in-out infinite',
        swing: 'swing 2.4s ease-in-out infinite',
        'pop-in': 'pop-in 0.6s ease-out both',
        rotor: 'rotor 0.16s linear infinite',
        orbit: 'spin 24s linear infinite',
        'orbit-reverse': 'spin 24s linear infinite reverse',
        'spin-reverse': 'spin 14s linear infinite reverse',
      },
    },
  },
  plugins: [],
};
