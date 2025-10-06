/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Brand Colors - Updated Design System
        primary: '#01133B',  // Primary Dark Blue
        secondary: '#00033B', // Secondary Dark Blue  
        accent: '#d29f22',    // Accent Golden
        'accent-light': '#E0C28F',  // Accent Light
        'accent-medium': '#D4AF37', // Accent Medium
        'accent-dark': '#d29f22',   // Accent Dark
        // Text Colors
        'text-primary': '#000000',
        'text-secondary': '#F5F5F5',
        'text-inverse': '#F4C430',
        // Background Colors
        'bg-primary': '#FFFFFF',
        'bg-section': '#FAF7ED',
        'bg-section-dark': '#5D490D',
        // Border Colors
        'border-primary': '#B68E12',
        'border-focus': '#F4C430',
        // State Colors
        success: '#0C9C48',
        warning: '#CF5701',
        error: '#9A1B18',
        info: '#666666',
        // Button State Colors - Updated for new design system
        'button-destructive': '#B3261E',
        'button-hover-primary': '#D4AF37',  // Accent Medium
        'button-hover-secondary': '#E0C28F', // Accent Light
        'button-pressed-secondary': '#B68E12', // Accent Darker
        'button-text-tertiary': '#1A1A1A',
        'button-text-tertiary-hover': '#454545',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'source-sans': ['Source Sans Pro', 'sans-serif'],
      },
      fontSize: {
        'display-large': ['64px', { lineHeight: '1.3', fontWeight: '600' }],
        'display-medium': ['56px', { lineHeight: '1.3', fontWeight: '600' }],
        'display-small': ['44px', { lineHeight: '1.3', fontWeight: '600' }],
        'body-large': ['18px', { lineHeight: '1.5' }],
        'body-medium': ['14px', { lineHeight: '1.5' }],
        'body-small': ['12px', { lineHeight: '1.5' }],
        'caption': ['12px', { lineHeight: '5' }],
        'link': ['10px', { lineHeight: '1.6', fontWeight: '600' }],
        'button-large': ['24px', { lineHeight: '1.25', fontWeight: '600' }],
        'label-medium': ['16px', { lineHeight: '1.3', fontWeight: '600' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        '4': '4px',
        '5': '5px',
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
