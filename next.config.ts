/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.logic.sector-soft.ru', 'api.megastroy.sector-soft.ru'], // Add your external hostname here
  },
};

module.exports = nextConfig;
