import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: '../assets/blocks',
        emptyOutDir: true,
        lib: {
            entry: resolve(__dirname, 'src/blocks/index.jsx'),
            name: 'AcademiaBlocks',
            formats: ['iife'],
            fileName: () => 'js/blocks.js'
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                '@wordpress/blocks',
                '@wordpress/block-editor',
                '@wordpress/components',
                '@wordpress/element',
                '@wordpress/i18n',
                '@wordpress/api-fetch'
            ],
            output: {
                globals: {
                    react: 'wp.element',
                    'react-dom': 'wp.element',
                    '@wordpress/blocks': 'wp.blocks',
                    '@wordpress/block-editor': 'wp.blockEditor',
                    '@wordpress/components': 'wp.components',
                    '@wordpress/element': 'wp.element',
                    '@wordpress/i18n': 'wp.i18n',
                    '@wordpress/api-fetch': 'wp.apiFetch'
                },
                assetFileNames: `css/[name].[ext]`
            }
        }
    }
})
