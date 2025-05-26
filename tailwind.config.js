const { hairlineWidth } = require('nativewind/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './screens/**/*.{ts,tsx}'],
    presets: [require('nativewind/preset')],
    safelist: [
        'p-5', 'p-1', 'p-2', 'p-3', 'p-4', 'p-7', 'p-8', 'p-9', 'p-10',
        'm-5', 'm-1', 'm-2', 'm-3', 'm-4', 'm-7', 'm-8', 'm-9', 'm-10',
        'mb-1', 'mb-2', 'mb-3', 'mb-4', 'mb-5', 'mb-6', 'mb-7', 'mb-8',
        'mt-1', 'mt-2', 'mt-3', 'mt-4', 'mt-5', 'mt-6', 'mt-7', 'mt-8',
        'ml-1', 'ml-2', 'ml-3', 'ml-4', 'ml-5', 'ml-6', 'ml-7', 'ml-8',
        'mr-1', 'mr-2', 'mr-3', 'mr-4', 'mr-5', 'mr-6', 'mr-7', 'mr-8',
        'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-7', 'px-8',
        'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-7', 'py-8',
    ],
    theme: {
        spacing: {
            '0': '0px',
            '0.5': '2px',
            '1': '4px',
            '1.5': '6px',
            '2': '8px',
            '2.5': '10px',
            '3': '12px',
            '3.5': '14px',
            '4': '16px',
            '5': '20px',
            '6': '24px',
            '7': '28px',
            '8': '32px',
            '9': '36px',
            '10': '40px',
            '11': '44px',
            '12': '48px',
            '14': '56px',
            '16': '64px',
            '20': '80px',
            '24': '96px',
            '28': '112px',
            '32': '128px',
            '36': '144px',
            '40': '160px',
            '44': '176px',
            '48': '192px',
            '52': '208px',
            '56': '224px',
            '60': '240px',
            '64': '256px',
            '72': '288px',
            '80': '320px',
            '96': '384px',
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
            },
            borderWidth: {
                hairline: hairlineWidth(),
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
            },
        },
    },
    plugins: [require('tailwindcss-animate')],
};
