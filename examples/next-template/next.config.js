const basePath = process.env.BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath,
    assetPrefix: basePath,
    output: 'export',
    distDir: 'dist',
    images: {
        unoptimized: true,
    },
    env: {
        basePath,
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
