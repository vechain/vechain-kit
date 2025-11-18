import { defineConfig } from 'tsup';
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

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
    // Copy locales after build
    onSuccess: async () => {
        const localesDir = join(__dirname, 'src', 'locales');
        const distLocalesDir = join(__dirname, 'dist', 'locales');

        // Create dist/locales directory
        if (!existsSync(distLocalesDir)) {
            mkdirSync(distLocalesDir, { recursive: true });
        }

        // Copy all JSON files
        const languages = ['en', 'de', 'it', 'fr', 'es', 'zh', 'ja'];
        languages.forEach((lang) => {
            const srcFile = join(localesDir, `${lang}.json`);
            const destFile = join(distLocalesDir, `${lang}.json`);
            if (existsSync(srcFile)) {
                copyFileSync(srcFile, destFile);
                console.log(`✓ Copied ${lang}.json to dist/locales/`);
            }
        });

        console.log('✓ All locale files copied successfully');
    },
});
