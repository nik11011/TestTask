import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        outDir: 'dist',
        assetsInlineLimit: 100000000,
        rollupOptions: {
            output: {
                inlineDynamicImports: true,
                manualChunks: undefined,
            },
        },
    },
})