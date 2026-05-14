/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        optimizePackageImports: ['@chakra-ui/react', '@vechain/vechain-kit'],
    },
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
