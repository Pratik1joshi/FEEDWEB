/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './pages/**/*.{js,ts,jsx,tsx,mdx}',
      './components/**/*.{js,ts,jsx,tsx,mdx}',
      './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-inter)", "system-ui", "sans-serif"],
          serif: ["var(--font-merriweather)", "Georgia", "serif"],
        },
        backgroundColor: {
          background: 'hsl(var(--background) / <alpha-value>)',
        },
        textColor: {
          foreground: 'hsl(var(--foreground) / <alpha-value>)',
        },
        colors: {
          white: '#ffffff',
          black: '#000000',
          border: {
            DEFAULT: 'rgb(229 231 235)',
          },
          input: "hsl(var(--input))",
          ring: "hsl(var(--ring))",
          background: 'hsl(var(--background))',
          foreground: 'hsl(var(--foreground))',
          primary: {
            DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
            foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
            foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
          },
          destructive: {
            DEFAULT: "hsl(var(--destructive))",
            foreground: "hsl(var(--destructive-foreground))",
          },
          muted: {
            DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
            foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
          },
          accent: {
            DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
            foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
          },
          popover: {
            DEFAULT: "hsl(var(--popover))",
            foreground: "hsl(var(--popover-foreground))",
          },
          card: {
            DEFAULT: "hsl(var(--card))",
            foreground: "hsl(var(--card-foreground))",
          },
          gray: {
            50: "#f9fafb",
            100: "#f3f4f6",
            200: "#e5e7eb",
            300: "#d1d5db",
            400: "#9ca3af",
            500: "#6b7280",
            600: "#4b5563",
            700: "#374151",
            800: "#1f2937",
            900: "#111827",
          },
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          marquee: {
            '0%': { transform: 'translateX(0%)' },
            '100%': { transform: 'translateX(-50%)' },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          marquee: 'marquee 25s linear infinite',
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
