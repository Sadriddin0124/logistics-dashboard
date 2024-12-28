/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['api.logic.sector-soft.ru', 'static.vecteezy.com'], // Add your external hostname here
  },
};

module.exports = nextConfig;
