import { defineConfig } from 'tsup';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    entry: {
        index: 'src/index.ts',
        'contracts/index': 'src/contracts/index.ts',
        'utils/index': 'src/utils/index.ts',
        'assets/index': 'src/assets/index.ts',
    },
    outDir: 'dist',
    format: ['cjs', 'esm'],
    minify: false,
    sourcemap: true,
    clean: true,
    external: ['react'],
    splitting: true, // Enable code splitting
    treeshake: true, // Enable tree shaking
    target: 'node18',
    skipNodeModulesBundle: true,
    metafile: true, // Generate meta file for better build analysis
    dts: true,
});
