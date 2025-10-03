/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
            kazakh: {
                blue: '#00AFCA',      // Голубой цвет флага Казахстана
                gold: '#FFC627',      // Золотой цвет флага Казахстана
                darkBlue: '#005E8A',  // Темно-голубой для контраста
                darkGold: '#E6A800',  // Темно-золотой для контраста
                light: '#E6F7FB',     // Светло-голубой для фона
                ornament: '#D4A017',  // Цвет для орнаментов
                platinum: '#E5E4E2',  // Premium platinum
                charcoal: '#36454F',  // Professional charcoal
                navy: '#1B2951',      // Elite navy
                cream: '#F5F5DC',     // Elegant cream
                silver: '#C0C0C0',    // Sophisticated silver
                deepBlue: '#003366',  // Deep professional blue
                elegantGray: '#8B8680', // Refined gray
                ink: '#0E1B2C',      // Deep ink blue
                paper: '#FEFEFE',    // Pure paper white
                accent: '#C6A769'    // Premium gold accent
            }
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
            'ornament-spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' }
            },
            'ornament-pulse': {
                '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                '50%': { opacity: 0.8, transform: 'scale(1.05)' }
            }
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
            'ornament-spin': 'ornament-spin 20s linear infinite',
            'ornament-pulse': 'ornament-pulse 3s ease-in-out infinite'
  		},
        backgroundImage: {
            'kazakh-ornament': "url('../src/assets/kazakh-ornament.svg')",
            'kazakh-pattern': "url('../src/assets/kazakh-pattern.svg')",
            'golden-horde': "url('../src/assets/golden-horde.svg')",
            'kazakh-emblem': "url('../src/assets/kazakh-emblem.svg')",
            'agi-world-logo': "url('../src/assets/agi-world-logo.svg')"
        },
        fontFamily: {
            'financial': ['Inter', 'system-ui', 'sans-serif'],
            'heading': ['Playfair Display', 'Georgia', 'serif'],
            'body': ['Inter', 'system-ui', 'sans-serif'],
            'elite': ['Playfair Display', 'Georgia', 'serif']
        },
        fontSize: {
            'financial-xs': ['0.75rem', { lineHeight: '1rem' }],
            'financial-sm': ['0.875rem', { lineHeight: '1.25rem' }],
            'financial-base': ['1rem', { lineHeight: '1.5rem' }],
            'financial-lg': ['1.125rem', { lineHeight: '1.75rem' }],
            'financial-xl': ['1.25rem', { lineHeight: '1.75rem' }],
            'financial-2xl': ['1.5rem', { lineHeight: '2rem' }],
            'financial-3xl': ['1.875rem', { lineHeight: '2.25rem' }]
        },
        spacing: {
            'financial': '0.75rem',
            'financial-lg': '1.5rem',
            'financial-xl': '2rem'
        }
  	}
  },
  plugins: [import("tailwindcss-animate")],
}

