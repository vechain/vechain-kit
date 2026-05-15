const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath,
    assetPrefix: basePath,
    output: 'export',
    distDir: 'dist',

    compiler: {
        removeConsole:
            process.env.NODE_ENV === 'production'
                ? {
                      exclude: ['error', 'warn'],
                  }
                : false,
    },

    turbopack: {
        resolveAlias: {
            '@/*': './src/*',
        },
    },

    experimental: {
        webpackBuildWorker: true,
        optimizePackageImports: ['@chakra-ui/react', '@vechain/vechain-kit'],
    },

    images: {
        unoptimized: true,
    },
    env: {
        basePath,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },

    poweredByHeader: false,
    generateEtags: false,
};

module.exports = nextConfig;
