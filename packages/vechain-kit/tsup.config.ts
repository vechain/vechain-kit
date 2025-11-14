import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'utils/index': 'src/utils/index.ts',
        'assets/index': 'src/assets/index.ts',
    },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    minify: true,
    sourcemap: true,
    clean: true,
    external: ['react'],
    splitting: true, // Enable code splitting
    treeshake: true, // Enable tree shaking
    target: 'node18',
    skipNodeModulesBundle: true,
    metafile: true, // Generate meta file for better build analysis
    // Simplified DTS generation to avoid rollup conflicts
    dts: {
        resolve: false, // Avoid resolving external types that cause conflicts
        compilerOptions: {
            skipLibCheck: true,
        },
    },
    // Performance optimizations
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    // Faster builds with less overhead
    shims: false,
});
