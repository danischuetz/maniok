import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    resolve: {
        alias: {
            'c4ke-lib': fileURLToPath(new URL('./packages/c4ke-lib/src/index.ts', import.meta.url))
        }
    },
    optimizeDeps: {
        exclude: ['c4ke-lib']
    },
    server: {
        fs: {
            allow: ['packages']
        }
    }
})
