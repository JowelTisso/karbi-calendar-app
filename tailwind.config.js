/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          background: '#FFFFFF',
          surface: '#F8F9FA',
          primary: '#6366F1', // Indigo
          secondary: '#8B5CF6', // Purple
          accent: '#EC4899', // Pink
          text: {
            primary: '#1F2937',
            secondary: '#6B7280',
            tertiary: '#9CA3AF',
          },
          border: '#E5E7EB',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          holiday: '#F59E0B',
          note: '#3B82F6',
          reminder: '#EC4899',
        },
        // Dark mode colors
        dark: {
          background: '#0F172A',
          surface: '#1E293B',
          primary: '#818CF8',
          secondary: '#A78BFA',
          accent: '#F472B6',
          text: {
            primary: '#F1F5F9',
            secondary: '#CBD5E1',
            tertiary: '#94A3B8',
          },
          border: '#334155',
          success: '#34D399',
          warning: '#FBBF24',
          error: '#F87171',
          holiday: '#FBBF24',
          note: '#60A5FA',
          reminder: '#F472B6',
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      fontFamily: {
        // Use system fonts for now
        sans: ['System'],
        mono: ['Courier'],
      },
      boxShadow: {
        // Soft, minimalist shadows
        'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
        'soft-md': '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
