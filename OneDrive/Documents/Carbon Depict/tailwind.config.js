/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'], // Enable dark mode via data-theme attribute
  theme: {
    screens: {
      'xs': '320px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Semantic tokens that respect theme (via CSS variables)
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-tertiary': 'var(--bg-tertiary)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'border-primary': 'var(--border-primary)',
        'border-secondary': 'var(--border-secondary)',

        // Brand colors (theme-independent)
        'brand-primary': 'var(--brand-primary)',
        'brand-secondary': 'var(--brand-secondary)',
        // Greenly Design System - Primary Colors (Mapped to Scope Page Design)
        'greenly-primary': '#07393C', // Midnight (Primary Dark)
        'greenly-primary-dark': '#052e31',
        'greenly-primary-light': '#0a4f53',

        // Secondary Colors
        'greenly-secondary': '#F9FAFB', // Surface/Background
        'greenly-accent': '#1B998B', // Teal (Primary Accent)

        // Extended Palette (from Scope Pages)
        'greenly-teal': '#1B998B',
        'greenly-midnight': '#07393C',
        'greenly-cedar': '#A15E49',
        'greenly-mint': '#B5FFE1',
        'greenly-desert': '#EDCBB1',

        // Status Colors
        'greenly-success': '#059669',
        'greenly-warning': '#D97706',
        'greenly-alert': '#DC2626',
        'greenly-info': '#0284C7',

        // Neutral Colors
        'greenly-charcoal': '#111827',
        'greenly-slate': '#4B5563',
        'greenly-gray': '#9CA3AF',
        'greenly-light': '#E5E7EB',
        'greenly-white': '#FFFFFF',
        'greenly-off-white': '#F9FAFB',

        // Legacy colors (maintain backwards compatibility)
        'cd-midnight': '#07393C',
        'cd-desert': '#EDCBB1',
        'cd-cedar': '#A15E49',
        'cd-mint': '#B5FFE1',
        'cd-teal': '#1B998B',
        'cd-bg': '#FFFFFF',
        'cd-surface': '#F9FAFB',
        'cd-text': '#111827',
        'cd-muted': '#4B5563',
        'cd-border': '#E5E7EB',
        'cd-error': '#DC2626',
        'cd-success': '#059669',
        'cd-warning': '#D97706',
        'cd-info': '#0284C7',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['Roboto Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['11px', { lineHeight: '1.4' }],
        'sm': ['12px', { lineHeight: '1.5' }],
        'base': ['14px', { lineHeight: '1.6' }],
        'lg': ['16px', { lineHeight: '1.6' }],
        'xl': ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.3' }],
        '3xl': ['32px', { lineHeight: '1.2' }],
        '4xl': ['36px', { lineHeight: '1.2' }],
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'base': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '18px',
        'full': '9999px',
      },
      boxShadow: {
        'greenly-sm': '0 2px 4px rgba(0, 0, 0, 0.08)',
        'greenly-md': '0 4px 8px rgba(0, 0, 0, 0.12)',
        'greenly-lg': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'greenly-primary': '0 2px 4px rgba(52, 165, 111, 0.2)',
        // Legacy shadows
        'cd-sm': '0 1px 2px rgba(16,24,40,0.05)',
        'cd-md': '0 4px 12px rgba(16,24,40,0.08)',
        'cd-lg': '0 10px 30px rgba(16,24,40,0.12)',
      },
      maxWidth: {
        'greenly': '1440px',
        'cd': '1200px',
      },
      transitionDuration: {
        'fast': '150ms',
        'base': '250ms',
        'slow': '350ms',
      },
      transitionTimingFunction: {
        'greenly-standard': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'greenly-in': 'cubic-bezier(0.4, 0.0, 1, 1)',
        'greenly-out': 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        'greenly-in-out': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        'cd-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-in': 'fadeIn 250ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        'slide-up': 'slideUp 350ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.0, 0.0, 0.2, 1)',
        'skeleton': 'skeletonPulse 1.5s infinite',
        // Legacy animations
        'fade-up': 'fadeUp 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 0.3s ease-out',
        bounce: 'bounce 2s infinite',
        skeletonPulse: 'skeletonPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        skeletonPulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(16px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.95)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        skeletonPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        // Legacy keyframes
        fadeUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(-20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-10%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
      },
    },
  },
  plugins: [],
}
