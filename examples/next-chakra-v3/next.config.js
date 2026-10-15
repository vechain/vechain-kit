const path = require('path');

// @privy-io/react-auth 3.x imports packages that are not installed, from code
// paths VeChain Kit never uses (Solana funding, Stripe onramp). Alias them to
// stubs so the app bundles.
const privyStubAliases = {
    '@solana-program/system': './privy-stubs/solana-program-system.js',
    '@stripe/stripe-js': './privy-stubs/stripe-js.js',
};

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
        optimizePackageImports: ['@chakra-ui/react', '@vechain/vechain-kit'],
    },
    turbopack: {
        resolveAlias: privyStubAliases,
    },
    webpack: (config) => {
        for (const [name, stub] of Object.entries(privyStubAliases)) {
            config.resolve.alias[name] = path.resolve(__dirname, stub);
        }
        return config;
    },
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
};

module.exports = nextConfig;
