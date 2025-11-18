import { defineConfig } from 'tsdown';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
    // Entry Points
    entry: {
        index: 'src/index.ts',
        'utils/index': 'src/utils/index.ts',
        'assets/index': 'src/assets/index.ts',
    },

    // Output Configuration
    outDir: 'dist',
    format: ['cjs', 'esm'],
    target: 'node18',
    clean: true,

    // Code Optimization
    minify: true,
    treeshake: true,
    splitting: true,

    // Source Maps & Debug
    sourcemap: true,

    // External Dependencies
    external: [
        'react',
        'react-dom',
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',
    ],
    skipNodeModulesBundle: true,

    // TypeScript Declaration Files
    dts: {
        resolve: false,
        compilerOptions: {
            skipLibCheck: true,
        },
    },

    // Build Analysis
    metafile: true,

    // Performance
    shims: false,
});
