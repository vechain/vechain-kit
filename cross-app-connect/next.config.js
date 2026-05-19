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
    },

    // Allow HMR / dev-resource requests from cloudflared tunnels.
    // trycloudflare.com generates a random subdomain per session, so a
    // wildcard avoids editing this file every time the tunnel restarts.
    allowedDevOrigins: ['*.trycloudflare.com'],

    images: {
        unoptimized: true,
    },
    env: {
        basePath,
    },

    poweredByHeader: false,
    generateEtags: false,
};

module.exports = nextConfig;
