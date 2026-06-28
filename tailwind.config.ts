import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palitra — Zapchasty logosiga mos: navy ko'k + to'q sariq urg'u
        bg: '#fafafb',
        surface: '#f1f3f7',
        card: '#ffffff',
        line: '#e4e7ef',
        line2: '#d2d7e3',
        ink: '#14182b', // navy-qora — logo matniga hamohang
        muted: '#6b7186',
        // Accent (logodagi to'q sariq chaqmoq) — eski "amber" token shu rangga sozlandi
        amber: {
          DEFAULT: '#f47a20',
          50: '#fff3ea',
          100: '#fde2cc',
          200: '#fbcfa6',
          300: '#f9b478',
          400: '#f6974a',
          500: '#f47a20',
          600: '#e06614',
          700: '#bd5210',
        },
        // Brand navy (logodagi "Z" va matn)
        navy: {
          DEFAULT: '#1b2a5e',
          50: '#eef1f8',
          100: '#d4dcef',
          200: '#aebde0',
          500: '#26397f',
          600: '#1b2a5e',
          700: '#131f47',
          800: '#0e1834',
          900: '#0a1128',
        },
        success: '#1f9d57',
        danger: '#d64545',
        info: '#2563eb',
        chip: '#eef0f6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '12px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(25,26,29,0.04), 0 4px 16px -8px rgba(25,26,29,0.10)',
        hover: '0 4px 12px rgba(25,26,29,0.08), 0 12px 32px -12px rgba(25,26,29,0.18)',
        header: '0 1px 0 rgba(231,229,225,0.9)',
        glow: '0 8px 24px -6px rgba(244,122,32,0.45)',
      },
      backgroundImage: {
        'hero-grid':
          'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
      },
      maxWidth: {
        container: '1240px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-down': {
          from: { opacity: '0', transform: 'translateY(-6px) scale(0.97)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)' },
          '60%': { transform: 'scale(1.12)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(244,122,32,0.45)' },
          '70%': { boxShadow: '0 0 0 12px rgba(244,122,32,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(244,122,32,0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.25s ease-out',
        'fade-up': 'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'fade-down': 'fade-down 0.18s ease-out both',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16,1,0.3,1) both',
        pop: 'pop 0.32s cubic-bezier(0.34,1.56,0.64,1)',
        float: 'float 7s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2.2s cubic-bezier(0.66,0,0,1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
