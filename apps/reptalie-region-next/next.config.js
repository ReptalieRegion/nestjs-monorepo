/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ['@reptalie-region/ui'],
    experimental: {
        appDir: true,
    },
};

module.exports = nextConfig;
