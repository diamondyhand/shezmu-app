/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        PROJECT_ID: process.env.PROJECT_ID,
        CHAIN_ID: process.env.CHAIN_ID
    },
    experimental: {
        appDir: true,
    },
    webpack: (config) => {
        config.externals.push("pino-pretty", "lokijs", "encoding");
        return config;
    },
}

module.exports = nextConfig
