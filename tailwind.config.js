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
        primary: '#1976d2', // Color principal (botón principal o enlaces clave)
        secondary: '#424242', // Color secundario (fondos secundarios o texto destacado)
        accent: '#82b1ff', // Color de acento (bordes, resaltados)
        red: {
          500: '#C1121F', // Rojo para botones críticos o errores
          700: '#EB0017', // Variación más oscura del rojo
        },
        success: '#4caf50', // Añadido para mensajes de éxito
        warning: '#ff9800', // Añadido para advertencias
        info: '#2196f3', // Añadido para mensajes de información
      },
      borderRadius: {
        custom: '12px', // Para botones, tarjetas, o cualquier otro componente único
      },
      spacing: {
        '72': '18rem', // Espaciados grandes
        '84': '21rem',
        '96': '24rem',
      },
      boxShadow: {
        'custom-light': '0 4px 6px rgba(0, 0, 0, 0.1)', // Sombra ligera personalizada
        'custom-dark': '0 10px 15px rgba(0, 0, 0, 0.3)', // Sombra más fuerte
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
    },
  },
  fontFamily: {
    sans: ['Graphik', 'sans-serif'],
    serif: ['Merriweather', 'serif'],
  },
  plugins: [
    require('@tailwindcss/forms'), // Mejora estilos de formularios
    require('@tailwindcss/typography'), // Para mejorar el diseño de texto
    require('@tailwindcss/aspect-ratio'), // Para mejorar el diseño de aspecto

  ],
}
