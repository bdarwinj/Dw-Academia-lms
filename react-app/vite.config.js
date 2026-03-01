import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // Output directory relative to plugin root
        outDir: '../assets/admin',
        emptyOutDir: true,
        manifest: true,
        rollupOptions: {
            input: resolve(__dirname, 'src/main.jsx'),
            output: {
                entryFileNames: `js/[name].js`,
                chunkFileNames: `js/[name].js`,
                assetFileNames: `css/[name].[ext]`
            }
        }
    },
    server: {
        // Config for Vite dev server if needed
        port: 3000,
        strictPort: true,
    }
})
