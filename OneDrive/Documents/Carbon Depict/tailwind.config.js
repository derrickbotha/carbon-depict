/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
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
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '48px',
        '2xl': '64px',
      },
      borderRadius: {
        sm: '6px',
        md: '12px',
        lg: '20px',
      },
      boxShadow: {
        'cd-sm': '0 1px 2px rgba(16,24,40,0.05)',
        'cd-md': '0 4px 12px rgba(16,24,40,0.08)',
        'cd-lg': '0 10px 30px rgba(16,24,40,0.12)',
      },
      maxWidth: {
        cd: '1200px',
      },
      transitionTimingFunction: {
        'cd-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        'slide-in': 'slideIn 0.3s ease-out',
        bounce: 'bounce 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
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
