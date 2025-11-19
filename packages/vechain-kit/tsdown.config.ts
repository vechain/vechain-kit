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

    // Source Maps & Debug
    sourcemap: true,

    // External Dependencies
    // Externalize all peer dependencies to avoid duplication
    external: [
        'react',
        'react-dom',
        '@chakra-ui/react',
        '@emotion/react',
        '@emotion/styled',
        'framer-motion',
        '@tanstack/react-query',
        '@vechain/dapp-kit-react',
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
    report: true,

    // Performance
    shims: false,
});
