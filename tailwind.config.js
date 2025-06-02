/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-', // Mantén el prefijo personalizado
  content: [
    './src/**/*.{html,ts,css,scss}', // Escanea todos los archivos relevantes
  ],
  corePlugins: {
    backdropFilter: true, // Asegúrate de que esté habilitado
  },
  theme: {
    screens: {
      'custom-md': '990px', // Breakpoint personalizado para 981px aplicado a los botones de header
      sm: '640px',
      'demo-sm': '720px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    aspectRatio: {
      auto: 'auto',
      square: '1 / 1',
      video: '16 / 9',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      13: '13',
      14: '14',
      15: '15',
      16: '16',
    },
    extend: {
      backdropBlur: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      colors: {
        // Enhanced brand colors with harmonious variations
        "emerald-green": {
          50: "#f0f9f4",
          100: "#dcf2e3",
          200: "#bce5ca",
          300: "#8dd1a7",
          400: "#5bb67d",
          500: "#2E8B57", // Main brand color
          600: "#267048",
          700: "#1f5a3a",
          800: "#1a4730",
          900: "#163a28",
        },
        coral: {
          50: "#fef7f6",
          100: "#fdeeed",
          200: "#fbd5d1",
          300: "#f8b5ae",
          400: "#f48b7f",
          500: "#FF6F61", // Main brand color
          600: "#e55a4f",
          700: "#c1453c",
          800: "#a03832",
          900: "#84302e",
        },
        "sky-blue": {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#87CEEB", // Main brand color
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        beige: {
          50: "#fefefe",
          100: "#F5F5DC", // Main brand color
          200: "#f0f0d5",
          300: "#e8e8c8",
          400: "#dcdcb8",
          500: "#d0d0a8",
          600: "#b8b890",
          700: "#9a9a78",
          800: "#7c7c60",
          900: "#5e5e48",
        },

        // Shadcn UI color system adapted to new harmonious palette
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        // Legacy colors for backward compatibility
        success: '#2E8B57', // Using emerald-green for success
        warning: '#ff9800',
        info: '#87CEEB', // Using sky-blue for info
        error: '#FF6F61', // Using coral for errors
      },
      borderRadius: {
        // lg: "var(--radius)",
        // md: "calc(var(--radius) - 2px)",
        // sm: "calc(var(--radius) - 4px)",
        custom: '12px' // Para botones, tarjetas, o cualquier otro componente único
      },
      spacing: {
        '72': '18rem', // Espaciados grandes
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        'custom-light': '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra ligera personalizada
        'custom-dark': '0 10px 15px rgba(0, 0, 0, 0.3)', // Sombra más fuerte
        soft: "0 2px 15px -3px rgba(46, 139, 87, 0.08), 0 10px 20px -2px rgba(46, 139, 87, 0.04)",
        "soft-lg": "0 10px 40px -15px rgba(46, 139, 87, 0.12), 0 20px 25px -5px rgba(46, 139, 87, 0.06)",
        warm: "0 2px 15px -3px rgba(255, 111, 97, 0.08), 0 10px 20px -2px rgba(255, 111, 97, 0.04)",
      },
      backgroundImage: {
        // Harmonious gradients with subtle transitions
        "gradient-primary": "linear-gradient(135deg, #2E8B57 0%, #5bb67d 100%)",
        "gradient-primary-hover": "linear-gradient(135deg, #267048 0%, #2E8B57 100%)",
        "gradient-soft": "linear-gradient(135deg, #f0f9f4 0%, #dcf2e3 100%)",
        "gradient-warm": "linear-gradient(135deg, #F5F5DC 0%, #fef7f6 100%)",
        "gradient-sky": "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        "gradient-hero": "linear-gradient(135deg, #f0f9f4 0%, #fef7f6 50%, #f0f9ff 100%)",
        "gradient-card": "linear-gradient(135deg, #ffffff 0%, #f0f9f4 100%)"
      },
      animation: {
        fade: 'fade 1s ease-in-out', // Animación personalizada
      },
      keyframes: {
        fade: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // o 'Nunito' Fuente principal
        hand: ['Patrick Hand', 'cursive'], // Fuente secundaria
        mono: ['Fira Code', 'monospace'], // Fuente monoespaciada
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Mejora estilos de formularios
    require('@tailwindcss/typography'), // Para mejorar el diseño de texto
    require('@tailwindcss/aspect-ratio'), // Para mejorar el diseño de aspecto
  ],
}
