import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ilusion: {
          red: '#e60000',
          black: '#1a1a1a',
          white: '#ffffff',
          gray: '#f5f5f5'
        }
      }
    },
  },
  plugins: [],
}
export default config