import { defineConfig } from 'vite'

export default defineConfig({
    // When deploying to GitHub Pages at https://GuanYung.github.io/MemoryGamesSuite/
    // change base to '/MemoryGamesSuite/'
    // For local dev and Netlify/Vercel, keep it as '/'
    base: '/MemoryGamesSuite/',
    test: {
        environment: 'jsdom',
        globals: true,
    }
})
