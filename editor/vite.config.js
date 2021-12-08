import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import polyfill from 'rollup-plugin-polyfill-node'

// https://vitejs.dev/config/
export default defineConfig({
  // plugins: [react(), polyfill()],
  plugins: [react()],
  root: './vite',
  publicDir: '../resources',
  server: {
    port: 3005,
    proxy: { '/v1': 'http://localhost:8000/v1' },
  },
  compilerOptions: {
    types: ['vite/client'],
  },
  define: {
    'process.env.NODE_ENV': "'development'",
    'process.env.REACT_APP_ENVIRONMENT_CONFIG': "'development'",
    'process.env.REACT_APP_AUTH0_REDIRECT_URI': undefined,
    'process.env.REACT_APP_AUTH0_CLIENT_ID': undefined,
    'process.env.REACT_APP_AUTH0_ENDPOINT': undefined,
    'process.env.REACT_APP_COMMIT_HASH': undefined,
    'process.env.GOOGLE_WEB_FONTS_KEY': "''",
    'process.env.UI_DEV': "'vite'",
  },
})