import { defineConfig } from 'vite'
import { tscWatch } from 'vite-plugin-tsc-watch'
import dts from 'vite-plugin-dts'
import react from '@vitejs/plugin-react'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tscWatch(),
    dts({ include: ['src'] }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      formats: ['es'],
      name: 'virtual-grid',
      fileName: 'main',
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime'],
    }
  }
})
