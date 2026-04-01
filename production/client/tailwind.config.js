/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: '#3b82f6',
                secondary: '#10b981',
                danger: '#ef4444',
                warning: '#f59e0b',
                dark: '#1f2937',
            },
        },
    },
    plugins: [],
};