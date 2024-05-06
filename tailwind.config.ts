import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    container: {
      center: true
    },

    extend: {
      fontSize: {
        '50': '50px'
      },
      colors: {
        'w-blue': '#2B3C5A',
        'w-silver-blue': '#4E4A53',
        'w-border': '#4F6A94'
      }
    }
  },
  plugins: []
}
export default config
