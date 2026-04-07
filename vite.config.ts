import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    resolve: {
        alias: {
            'maniok-core': fileURLToPath(
                new URL('./packages/maniok-core/src/index.ts', import.meta.url)
            )
        }
    },
    optimizeDeps: {
        exclude: ['maniok-core']
    },
    server: {
        fs: {
            allow: ['packages']
        }
    }
})
