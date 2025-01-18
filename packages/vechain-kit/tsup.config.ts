import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: 'esm',
    minify: true,
    sourcemap: true,
    dts: {
        // Splitting type definitions into chunks
        chunks: true,
        // Increase memory limit for type generation
        memoryLimit: 8192
    },
    clean: true,
    external: ['react']
});
