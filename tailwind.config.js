/** @type {import('tailwindcss').Config} */

// npm
import typography from '@tailwindcss/typography'
import daisyui from 'daisyui'

import { lightTheme, darkTheme } from "./consts.js"

export default {
  content: ['src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mdoc}'],
  theme: {
    container: {
      center: true,
    },
  },
  plugins: [
    typography,
    daisyui,
  ],
  daisyui: {
    themes: [lightTheme, darkTheme],
    darkTheme,
    logs: false,
  },
}
