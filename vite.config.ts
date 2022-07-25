import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import svgrPlugin from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  server : {
    proxy: {
        "/api" : "http://localhost:5000"
    }
  },
  build: {
    outDir: 'build',
  },
  plugins: [
    reactRefresh(),
  ],
})