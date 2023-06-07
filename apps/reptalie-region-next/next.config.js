/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ['@reptalie-region/ui'],
    experimental: {
        appDir: true,
        serverActions: true,
    },
    images: {
        domains: ['localhost', 'search.naver.com', 'search.pstatic.net'],
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        });

        config.experiments = { ...config.experiments, topLevelAwait: true };

        return config;
    },
};

module.exports = nextConfig;
